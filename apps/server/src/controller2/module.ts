import { Api } from '@modtree/repo-api'
import { Request, Response } from 'express'

export class ModuleController {
  /**
   * returns all the modules in the database
   *
   * @param {Api} api
   */
  static list = (api: Api) => (_req: Request, res: Response) => {
    api.moduleRepo.find().then((results) => {
      res.json(results)
    })
  }

  /**
   * gets one module from the database (using its module code)
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request, res: Response) => {
    api.moduleRepo
      .findOneByOrFail({ moduleCode: req.params.moduleCode })
      .then((result) => {
        res.json(result)
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
  }
}
