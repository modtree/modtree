import { Api } from '@modtree/repo-api'
import { Request } from 'express'

export class ModuleFullApi {
  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request) => {
    return api.moduleFullRepo.findOneByCode(req.params.moduleCode)
  }
}
