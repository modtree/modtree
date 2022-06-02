import { Request, Response } from 'express'
import { copy } from '..'
import { db } from '../config'
import { Degree } from '../entity'
import { DegreeRepository } from '../repository'
import { emptyInit } from '../utils/empty'

/** Degree API controller */
export class degreeController {
  private degreeRepo = DegreeRepository(db)

  /**
   * creates a Degree
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = emptyInit.Degree
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res.json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    const degree = await this.degreeRepo.initialize(props)
    res.json(degree)
  }

  /**
   * finds one Degree by id
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    const degree: Degree = await this.degreeRepo.findOne({
      where: { id: req.params.degreeId },
      relations: {
        modules: true,
      },
    })
    res.json({
      ...degree,
      modules: degree.modules.map((m) => m.moduleCode),
    })
  }
}
