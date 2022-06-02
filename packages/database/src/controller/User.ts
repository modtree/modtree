import { Request, Response } from 'express'
import { copy } from '../utils'
import { db } from '../config'
import { User } from '../entity'
import { UserRepository } from '../repository'
import { emptyInit } from '../utils/empty'
import type { UserController } from '../../types/controller'
import { response } from '../../types/api-response'

/**
 * flattens a user to response shape
 * @param {User} user
 * @return {response.User}
 */
function flatten(user: User): response.User {
  return {
    ...user,
    moduleDoing: user.modulesDoing.map((m) => m.moduleCode),
    modulesDone: user.modulesDone.map((m) => m.moduleCode),
    savedDegrees: user.savedDegrees.map((d) => d.id),
  }
}

/** User api controller */
export class userController implements UserController {
  private userRepo = UserRepository(db)

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
   * gets one User by id
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    console.log('getting user by id:', req.params.userId)
    this.userRepo
      .findOne({
        where: { id: req.params.userId },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedDegrees: true
        },
      })
      .then((user) => {
        res.json(flatten(user))
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
    const flat = users.map((u) => flatten(u))
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
