import { Request, Response } from 'express'
import { IModuleController } from '@modtree/types'
import { db } from '@modtree/typeorm-config'
import { ModuleRepository } from '@modtree/repo-module'

/** Module api controller */
export class ModuleController implements IModuleController {
  private moduleRepo = new ModuleRepository(db)

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
   * gets one module from the database (using its module code)
   *
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    this.moduleRepo
      .findOneByOrFail({ moduleCode: req.params.moduleCode })
      .then((result) => {
        res.json(result)
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
  }
}
