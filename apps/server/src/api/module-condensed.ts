import { Api } from '@modtree/repo-api'
import { CustomReqParams, CustomReqQuery } from '@modtree/types'
import { Request } from 'express'
import { Like } from 'typeorm'

type ModuleCodes = {
  moduleCodes: string[]
}

export class ModuleCondensedApi {
  /**
   * returns all the modules in the database
   *
   * @param {Api} api
   */
  static list = (api: Api) => (req: CustomReqQuery<ModuleCodes>) => {
    if (req.query.moduleCodes) {
      return api.moduleCondensedRepo.findByCodes(req.query.moduleCodes)
    } else {
      return api.moduleCondensedRepo.find()
    }
  }

  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request) => {
    return api.moduleCondensedRepo.findOneByOrFail({
      moduleCode: req.params.moduleCode,
    })
  }

  /**
   * gets a top 10 closest modules from the database using LIKE query
   *
   * @param {Api} api
   */
  static search =
    (api: Api) => (req: CustomReqParams<{ searchQuery: string }>) => {
      return api.moduleCondensedRepo.find({
        where: { moduleCode: Like(`${req.params.searchQuery}%`) },
        take: 10,
      })
    }
}
