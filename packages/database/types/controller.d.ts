import { Request, Response } from 'express'

export interface UserController {
  create(req: Request, res: Response): Promise<void>
  get(req: Request, res: Response): Promise<void>
  all(req: Request, res: Response): Promise<void>
  one(req: Request, res: Response): Promise<void>
}

export interface ModuleCondensedController {
  all(req: Request, res: Response): Promise<void>
  one(req: Request, res: Response): Promise<void>
}

