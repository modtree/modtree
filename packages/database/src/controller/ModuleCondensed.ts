import { db } from '../config'
import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { ModuleCondensedRepository } from '../repository'

/** ModuleCondensed api controller */
export class moduleCondensedController {
  private moduleRepo = ModuleCondensedRepository(db)

  /**
   * returns all the modules in the database
   * @param {Request} req
   * @param {Response} res
   */
  async all(req: Request, res: Response) {
    console.log(Object.keys(req).length)
    const a = await this.moduleRepo.find()
    res.json({ message: 'done', result: a })
  }

  /**
   * returns all the modules in the database
   * @param {Request} _
   * @param {Response} res
   */
  async hello(_: Request, res: Response) {
    res.json({ message: 'helloworld' })
  }

  /**
   * searches the modules in the database (using a substring)
   * @param {Request} req
   * @param {Response} res
   */
  async one(req: Request, res: Response) {
    this.moduleRepo
      .find({
        where: {
          moduleCode: Like(`%${req.params.moduleCode}%`),
        },
      })
      .then((result) => {
        res.json({ message: 'done', result })
      })
      .catch((err) => {
        res.json({ message: 'error', error: err })
      })
  }
}
