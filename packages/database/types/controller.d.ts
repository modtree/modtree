import { Request, Response } from 'express'

interface Controller {
  all(req: Request, res: Response): Promise<void>
  one(req: Request, res: Response): Promise<void>
}

export interface UserController extends Controller {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
}

export interface ModuleCondensedController extends Controller {}
