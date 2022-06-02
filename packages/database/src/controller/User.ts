import { Request, Response } from 'express'
import { copy } from '..'
import { db } from '../config'
import { User } from '../entity'
import { UserRepository } from '../repository'
import { emptyInit } from '../utils/empty'
import type { UserController } from '../../types/controller'

/** ModuleCondensed api controller */
export class userController implements UserController {
  private userRepo = UserRepository(db)

  /**
   * creates a User
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = emptyInit.User
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res.json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    const user: User = await this.userRepo.initialize(props)
    res.json(user)
  }

  /**
   * finds one User by id
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    const user: User = await this.userRepo.findOne({
      where: { id: req.params.userId },
      relations: {
        modulesDone: true,
        modulesDoing: true,
      },
    })
    res.json({
      ...user,
      modulesDone: user.modulesDone.map((m) => m.moduleCode),
      modulesDoing: user.modulesDoing.map((m) => m.moduleCode),
    })
  }

  /**
   * get all Users
   * @param {Request} req
   * @param {Response} res
   */
  async all(req: Request, res: Response) {
    const users = await this.userRepo.find()
    res.json({ message: 'done', result: users })
  }

  /**
   * get one User
   * @param {Request} req
   * @param {Response} res
   */
  async one(req: Request, res: Response) {
    const user = await this.userRepo.findOneBy({ ...req.body })
    if (user) res.json({ message: 'done', result: user })
    else res.json({ message: 'not found' })
  }
}
