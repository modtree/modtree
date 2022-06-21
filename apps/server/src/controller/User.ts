import { Request, Response } from 'express'
import { IUserController, CustomReqQuery, CustomReqBody } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { validate } from '../validate'
import { getRelationNames } from '@modtree/repo-base'
import { Api } from '@modtree/repo-api'
import { Controller } from './base'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

/** User api controller */
export class UserController extends Controller implements IUserController {
  constructor(api: Api) {
    super(api)
  }
  private userRelations = getRelationNames(this.userRepo)

  /**
   * creates a User
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
        res.json(flatten.user(user))
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
    this.userRepo
      .findOneById(req.params.userId)
      .then((user) => {
        res.json(flatten.user(user))
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * gets one User by primary keys
   * at least one of id, authZeroId, or email
   *
   * @param {Request} req
   * @param {Response} res
   */
  async getByPrimaryKeys(req: CustomReqBody<ListRequest>, res: Response) {
    if (!validate(req, res)) return
    const { id, authZeroId, email } = req.body
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
      .findOneById(req.params.userId)
      .then((user) => this.userRepo.remove(user))
      .then((deleteResult) => {
        res.json({ deleteResult })
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
  async insertDegrees(req: Request, res: Response) {
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
    this.userRepo
      .findOneOrFail({
        where: { id },
        relations: this.userRelations,
      })
      .then((user) => this.userRepo.insertDegrees(user, degreeIds))
      .then((userRes) => {
        res.json(flatten.user(userRes))
      })
  }
}
