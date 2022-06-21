import { Api } from '@modtree/repo-api'
import { Request } from 'express'

export class ModuleApi {
  /**
   * returns all the modules in the database
   *
   * @param {Api} api
   */
  static list = (api: Api) => () => {
    return api.moduleRepo.find()
  }

  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request) => {
    return api.moduleRepo.findOneByOrFail({ moduleCode: req.params.moduleCode })
  }
}
