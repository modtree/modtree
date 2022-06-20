import { Request, Response } from 'express'
import { IModuleController } from '@modtree/types'
import { db } from '@modtree/typeorm-config'
import { Api } from '@modtree/repo-api'

/** Module api controller */
export class ModuleController implements IModuleController {
  private api = new Api(db)
  private moduleRepo = this.api.moduleRepo

  /**
   * returns all the modules in the database
   *
   * @param {Request} _req
   * @param {Response} res
   */
  async list(_req: Request, res: Response) {
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
