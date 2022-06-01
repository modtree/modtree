import { Request, Response } from 'express'
import { copy } from '..'
import { db } from '../config'
import { DegreeRepository } from '../repository'
import { emptyInit } from '../utils/empty'

/** ModuleCondensed api controller */
export class userController {
  private degreeRepo = DegreeRepository(db)

  /**
   * creates a User
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = emptyInit.Degree
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res.json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    const a = await this.degreeRepo.initialize(props)
    res.json({ message: 'done', result: a })
  }
}
