import { db } from '../config'
import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { ModuleCondensedRepository } from '../repository'
import type { ModuleCondensedController } from '../../types/controller'

/** ModuleCondensed api controller */
export class moduleCondensedController implements ModuleCondensedController {
  private moduleRepo = ModuleCondensedRepository(db)

  /**
   * returns all the modules in the database
   * @param {Request} req
   * @param {Response} res
   */
  async all(req: Request, res: Response) {
    console.log(Object.keys(req).length)
    const all = await this.moduleRepo.find()
    res.json(all)
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
        res.json(result)
      })
      .catch((error) => {
        res.status(500).json({ error })
      })
  }
}
