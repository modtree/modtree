import { Request, Response } from 'express'
import { copy } from '../utils'
import { db } from '../config'
import { Degree } from '../entity'
import { DegreeRepository } from '../repository'
import { emptyInit } from '../utils/empty'
import { response } from '../../types/api-response'

/**
 * flattens a degree to response shape
 */
function flatten(degree: Degree): response.Degree {
  return { ...degree, modules: degree.modules.map((m) => m.moduleCode) }
}

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
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
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
    this.degreeRepo
      .findOne({
        where: { id: req.params.degreeId },
        relations: {
          modules: true,
        },
      })
      .then((degree) => {
        res.json(flatten(degree))
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }

  /**
   * hard-deletes one Degree by id
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    const deleteResult = await this.degreeRepo.delete({
      id: req.params.degreeId,
    })
    res.json({ deleteResult })
  }

  /**
   * list all degrees in the database
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    const results = await this.degreeRepo.find({ relations: { modules: true } })
    const flat = results.map((degree) => flatten(degree))
    res.json(flat)
  }
}
