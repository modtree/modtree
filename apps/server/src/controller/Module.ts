import { Request, Response } from 'express'
import { IModuleController } from '@modtree/types'
import { Api } from '@modtree/repo-api'
import { Controller } from './base'

/** Module api controller */
export class ModuleController extends Controller implements IModuleController {
  constructor(api: Api) {
    super(api)
  }

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
