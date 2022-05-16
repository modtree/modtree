import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { ModuleCondensed } from '../entity-repo/ModuleCondensed'
import { Like } from 'typeorm'

export class ModuleCondesnedController {
  private moduleRepo = AppDataSource.getRepository(ModuleCondensed)

  async all(req: Request, res: Response) {
    console.log(Object.keys(req).length)
    const a = await this.moduleRepo.find()
    res.json({ message: 'done', result: a })
  }

  async one(req: Request, res: Response) {
    this.moduleRepo
      .find({
        where: {
          moduleCode: Like(`%${req.params.moduleCode}%`),
        },
      })
      .then((result) => {
        res.json({ message: 'done', result })
      })
      .catch((err) => {
        res.json({ message: 'error', error: err })
      })
    return
  }
}
