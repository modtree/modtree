import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { ModuleCondensed } from '../entity-repo/ModuleCondensed'
import { Like } from 'typeorm'

export class ModuleCondesnedController {
  private moduleRepo = AppDataSource.getRepository(ModuleCondensed)

  async all(req: Request, res: Response) {
    req.isPaused()
    res.json({message: "done"})
    return this.moduleRepo.find()
  }

  async one(req: Request, res: Response) {
    const a = this.moduleRepo.findOneBy({
      moduleCode: Like(`%${req.body.moduleCode}%`),
    })

    res.json({message: "done"})
    return   }

  async save(req: Request, res: Response) {
    res.json({message: "done"})
    return this.moduleRepo.save(req.body)
  }

  async remove(req: Request, res: Response) {
    let userToRemove = await this.moduleRepo.findOneBy({
      moduleCode: req.params.id,
    })
    await this.moduleRepo.remove(userToRemove)
    res.json({message: "done"})
  }
}
