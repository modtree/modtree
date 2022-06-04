import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { db } from '../config'
import { ModuleCondensedRepository } from '../repository'
import type { IModuleCondensedController } from '../../types/controller'

/** ModuleCondensed api controller */
export class ModuleCondensedController implements IModuleCondensedController {
  private moduleRepo = ModuleCondensedRepository(db)

  /**
   * returns all the modules in the database
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    const all = await this.moduleRepo.find()
    res.json(all)
  }

  /**
   * searches the modules in the database (using a substring)
   *
   * @param {Request} req
   * @param {Response} res
   */
  async find(req: Request, res: Response) {
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
