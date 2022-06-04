import { Request, Response } from 'express'

interface IController {
  list(req: Request, res: Response): Promise<void>
}

export interface IUserController extends IController {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
}

export interface IDegreeController extends IController {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
}

export interface IGraphController extends IController {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
}

export type IModuleCondensedController = IController
