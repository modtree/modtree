import { Request, Response } from 'express'
import { IUserController, CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { db } from '@modtree/typeorm-config'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { validate } from '../validate'
import { getRelationNames } from '@modtree/repo-base'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

/** User api controller */
export class UserController implements IUserController {
  private userRepo = new UserRepository(db)
  private userRelations = getRelationNames(this.userRepo)

  private degreeRepo = new DegreeRepository(db)

  /**
   * creates a Degree
   *
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    if (!validate(req, res)) return
    const props = emptyInit.User
    copy(req.body, props)
    this.userRepo
      .initialize(props)
      .then((user) => {
        res.json(user)
      })
      .catch(() => res.status(500))
  }

  /**
   * gets one User by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: CustomReqQuery<ListRequest>, res: Response) {
    if (!validate(req, res)) return
    const { id, authZeroId, email } = req.query
    if ([id, authZeroId, email].every((x) => x === undefined)) {
      res
        .status(400)
        .json({ message: 'needs at least one of id, authZeroId, or email' })
    }
    this.userRepo
      .findOneOrFail({
        where: { id, authZeroId, email },
        relations: this.userRelations,
      })
      .then((user) => {
        res.json(flatten.user(user))
      })
  }

  /**
   * get all Users
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: CustomReqQuery<ListRequest>, res: Response) {
    if (!validate(req, res)) return
    const { id, authZeroId, email } = req.query
    this.userRepo
      .find({
        where: { id, authZeroId, email },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedDegrees: true,
          savedGraphs: true,
        },
      })
      .then((users) => {
        const flat = users.map((u) => flatten.user(u))
        res.json(flat)
      })
  }

  /**
   * hard-deletes a User by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    this.userRepo
      .delete({
        id: req.params.userId,
      })
      .then((deleteResult) => {
        res.json({ deleteResult })
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * gets one User by email
   *
   * @param {Request} req
   * @param {Response} res
   */
  async getByEmail(req: Request, res: Response) {
    if (!validate(req, res)) return
    this.userRepo
      .findOneByEmail(req.body.email)
      .then((user) => {
        res.json(flatten.user(user))
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * gets one User by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async getFull(req: Request, res: Response) {
    this.userRepo
      .findOne({
        where: { id: req.params.userId },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedDegrees: {
            modules: true,
          },
        },
      })
      .then((user) => {
        res.json(user)
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * inserts a degree into a User
   *
   * @param {Request} req
   * @param {Response} res
   */
  async insertDegree(req: Request, res: Response) {
    const id = req.params.userId
    const requestKeys = Object.keys(req.body)
    const requiredKeys = ['degreeIds']
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    const { degreeIds } = req.body
    Promise.all([
      this.degreeRepo.findByIds(degreeIds),
      this.userRepo.findOneOrFail({
        where: { id },
        relations: { savedDegrees: true },
      }),
    ]).then(([degrees, user]) => {
      user.savedDegrees.push(...degrees)
      const result = this.userRepo.save(user)
      res.json(result)
    })
  }
}
