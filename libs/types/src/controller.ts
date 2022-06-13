import { Request, Response } from 'express'

type APIEndpoint = (req: Request, res: Response) => Promise<void>

interface IReads {
  list: APIEndpoint
}

interface IController extends IReads {
  create: APIEndpoint
  get: APIEndpoint
  delete: APIEndpoint
}

export interface IUserController extends IController {
  getFull: APIEndpoint
  insertDegree: APIEndpoint
}

export type IDegreeController = IController

export interface IGraphController extends IController {
  toggle: APIEndpoint
}

export interface IModuleCondensedController extends IReads {
  find: APIEndpoint
}

export interface IModuleController extends IReads {
  get: APIEndpoint
}
