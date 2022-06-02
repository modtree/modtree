import { Request, Response } from 'express'

interface Controller {
  list(req: Request, res: Response): Promise<void>
}

export interface UserController extends Controller {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
}

export type ModuleCondensedController = Controller
