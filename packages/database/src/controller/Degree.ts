import { Request, Response } from 'express'
import { copy, EmptyInit, Flatten } from '../utils'
import { db } from '../config'
import { DegreeRepository } from '../repository'
import { IDegreeController } from '../../types/controller'

/** Degree API controller */
export class DegreeController implements IDegreeController {
  private degreeRepo = DegreeRepository(db)

  /**
   * creates a Degree
   *
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = EmptyInit.Degree
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    this.degreeRepo.initialize(props).then((degree) => {
      res.json(degree)
    })
  }

  /**
   * finds one Degree by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    this.degreeRepo
      .findOneById(req.params.degreeId)
      .then((degree) => {
        res.json(Flatten.degree(degree))
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }

  /**
   * hard-deletes one Degree by id
   *
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
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    const results = await this.degreeRepo.find({ relations: { modules: true } })
    const flat = results.map((degree) => Flatten.degree(degree))
    res.json(flat)
  }
}
