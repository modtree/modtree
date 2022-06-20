import { Request, Response } from 'express'

type APIEndpoint = (req: Request, res: Response) => Promise<void>

interface IReads {
  list: APIEndpoint
}

interface IController extends IReads {
  create: APIEndpoint
  get: APIEndpoint
  list: APIEndpoint
  delete: APIEndpoint
}

export interface IUserController extends IController {
  getByPrimaryKeys: APIEndpoint
  getFull: APIEndpoint
  insertDegrees: APIEndpoint
}

export type IDegreeController = IController

export interface IGraphController extends IController {
  toggle: APIEndpoint
  updateFrontendProps: APIEndpoint
}

export interface IModuleCondensedController extends IReads {
  list: APIEndpoint
  get: APIEndpoint
  findByCodes: APIEndpoint
}

export interface IModuleController extends IReads {
  list: APIEndpoint
  get: APIEndpoint
}
