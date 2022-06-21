import { Api } from '@modtree/repo-api'
import { CustomReqParams, CustomReqQuery } from '@modtree/types'
import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { validate } from '../validate'

type ModuleCodes = {
  moduleCodes: string[]
}

export class ModuleCondensedApi {
  /**
   * returns all the modules in the database
   *
   * @param {Api} api
   */
  static list =
    (api: Api) => (req: CustomReqQuery<ModuleCodes>, res: Response) => {
      if (!validate(req, res)) return
      if (req.query.moduleCodes) {
        api.moduleCondensedRepo
          .findByCodes(req.query.moduleCodes)
          .then((result) => {
            res.json(result)
          })
      } else {
        api.moduleCondensedRepo.find().then((results) => {
          res.json(results)
        })
      }
    }

  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static get = (api: Api) => (req: Request, res: Response) => {
    api.moduleCondensedRepo
      .findOneByOrFail({ moduleCode: req.params.moduleCode })
      .then((result) => {
        res.json(result)
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
  }

  /**
   * gets one module from the database using its module code
   *
   * @param {Api} api
   */
  static search =
    (api: Api) =>
    (req: CustomReqParams<{ moduleCode: string }>, res: Response) => {
      api.moduleCondensedRepo
        .find({ where: { moduleCode: Like(`${req.params.moduleCode}%`) } })
        .then((result) => {
          res.json(result)
        })
        .catch((error) => {
          res.status(404).json({ error })
        })
    }
}
