import { Api } from '@modtree/repo-api'
import { CustomReqParams } from '@modtree/types'
import { Request } from 'express'
import { Like } from 'typeorm'

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

  /**
   * gets a top 10 closest modules from the database using LIKE query
   *
   * @param {Api} api
   */
  static search =
    (api: Api) => (req: CustomReqParams<{ searchQuery: string }>) => {
      return api.moduleRepo.find({
        where: { moduleCode: Like(`${req.params.searchQuery}%`) },
        take: 10,
      })
    }
}
