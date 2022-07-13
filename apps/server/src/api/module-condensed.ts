import { Api } from '@modtree/repos'
import { CustomReqParams, CustomReqQuery } from '@modtree/types'
import { Request } from 'express'
import { Like } from 'typeorm'

type ModuleCodes = {
  moduleCodes: string[] | string
}

export class ModuleCondensedApi {
  /**
   * returns all the modules in the database
   *
   * @param {Api} api
   */
  static list = (api: Api) => (req: CustomReqQuery<ModuleCodes>) => {
    const moduleCodes = req.query.moduleCodes
    if (Array.isArray(moduleCodes)) {
      return api.moduleCondensedRepo.findByCodes(moduleCodes)
    } else if (moduleCodes.length > 0) {
      return api.moduleCondensedRepo.findByCodes([moduleCodes])
    } else {
      return []
    }
  }

  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request) => {
    return api.moduleCondensedRepo.findByCode(req.params.moduleCode)
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
