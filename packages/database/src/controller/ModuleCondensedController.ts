import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import { ModuleCondensed } from '../entity-repo/ModuleCondensed'
import { Like } from 'typeorm'

/** ModuleCondensed api controller */
export class ModuleCondesnedController {
  private moduleRepo = AppDataSource.getRepository(ModuleCondensed)

  /**
   * returns all the modules in the database
   * @param {Request} req
   * @param {Response} res
   */
  async all(req: Request, res: Response) {
    console.log(Object.keys(req).length)
    const a = await this.moduleRepo.find()
    res.json({ message: 'done', result: a })
  }

  /**
   * searches the modules in the database (using a substring)
   * @param {Request} req
   * @param {Response} res
   */
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
  }
}
