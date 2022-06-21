import { Api } from '@modtree/repo-api'
import {
  IDegreeRepository,
  IGraphRepository,
  IModuleCondensedRepository,
  IModuleRepository,
  IUserRepository,
} from '@modtree/types'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

/**
 * meant to be used as a one-liner at the top of each controller method
 * ```
 * if (!validate(req, res)) return
 * ```
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {boolean}
 */
export function validate(req: Request, res: Response): boolean {
  const errors = validationResult(req)
  const ok = errors.isEmpty()
  if (!ok) res.status(400).json({ errors: errors.array() })
  return ok
}

export class Controller {
  api: Api
  degreeRepo: IDegreeRepository
  userRepo: IUserRepository
  graphRepo: IGraphRepository
  moduleRepo: IModuleRepository
  moduleCondensedRepo: IModuleCondensedRepository
  constructor(api: Api) {
    this.api = api
    this.degreeRepo = api.degreeRepo
    this.userRepo = api.userRepo
    this.graphRepo = api.graphRepo
    this.moduleRepo = api.moduleRepo
    this.moduleCondensedRepo = api.moduleCondensedRepo
  }
}
