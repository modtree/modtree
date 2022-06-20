import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { IModuleCondensedController } from '@modtree/types'
import { Api } from '@modtree/repo-api'
import { Controller } from './base'

/** ModuleCondensed api controller */
export class ModuleCondensedController
  extends Controller
  implements IModuleCondensedController
{
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
    this.moduleCondensedRepo.find().then((results) => {
      res.json(results)
    })
  }

  /**
   * searches the modules in the database (using a substring)
   *
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    this.moduleCondensedRepo
      .find({
        where: {
          moduleCode: Like(`%${req.params.moduleCode}%`),
        },
      })
      .then((result) => {
        res.json(result)
      })
      .catch((error) => {
        res.status(500).json({ error })
      })
  }

  /**
   * find many by codes
   *
   * @param {Request} req
   * @param {Response} res
   */
  async findByCodes(req: Request, res: Response) {
    this.moduleCondensedRepo
      .findByCodes(req.body.moduleCodes)
      .then((result) => {
        res.json(result)
      })
  }
}
