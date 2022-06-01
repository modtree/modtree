import { Request, Response } from 'express'
import { copy } from '..'
import { db } from '../config'
import { UserRepository } from '../repository'
import { emptyInit } from '../utils/empty'

/** ModuleCondensed api controller */
export class userController {
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
    const a = await this.userRepo.initialize(props)
    res.json({ message: 'done', result: a })
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
    if (user)
      res.json({ message: 'done', result: user })
    else
      res.json({ message: 'not found' })
  }
}
