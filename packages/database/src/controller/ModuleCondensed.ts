import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { IModuleCondensedController } from '@modtree/types'
import { db } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '../repository'

/** ModuleCondensed api controller */
export class ModuleCondensedController implements IModuleCondensedController {
  private moduleRepo = getModuleCondensedRepository(db)

  /**
   * returns all the modules in the database
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    this.moduleRepo.find().then((results) => {
      res.json(results)
    })
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
