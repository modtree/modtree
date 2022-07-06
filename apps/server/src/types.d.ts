import { Api } from '@modtree/repos'
import { ValidationChain } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

/**
 * do try to follow this order of fields when implementing routes
 */
export type Route = {
  method: 'post' | 'put' | 'patch' | 'get' | 'delete'
  route: string
  fn: (_api: Api) => (req: Request, res: Response, next: NextFunction) => any
  validators: ValidationChain[]
}
