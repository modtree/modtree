import { Request, Response } from 'express'
import { db } from '../config'
import { DegreeRepository, UserRepository } from '../repository'
import { emptyInit, flatten, copy } from '../utils'
import type { UserController } from '../../types/controller'

/** User api controller */
export class userController implements UserController {
  private userRepo = UserRepository(db)
  private degreeRepo = DegreeRepository(db)

  /**
   * creates a Degree
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = emptyInit.User
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    this.userRepo.initialize(props).then((user) => {
      res.json(user)
    })
  }

  /**
   * creates a User
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
    const degreeIds: string[] = req.body.degreeIds
    const degrees = await this.degreeRepo.findByIds(degreeIds)
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { savedDegrees: true },
    })
    user.savedDegrees.push(...degrees)
    const result = this.userRepo.save(user)
    res.json(result)
  }

  /**
   * gets one User by id
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
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
   * gets one User by id
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
   * get all Users
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    const users = await this.userRepo.find({
      relations: {
        modulesDone: true,
        modulesDoing: true,
        savedDegrees: true,
      },
    })
    const flat = users.map((u) => flatten.user(u))
    res.json(flat)
  }

  /**
   * hard-deletes one User by id
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    const deleteResult = await this.userRepo.delete({
      id: req.params.userId,
    })
    res.json({ deleteResult })
  }
}
