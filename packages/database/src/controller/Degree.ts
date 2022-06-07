import { Request, Response } from 'express'
import { copy, emptyInit, flatten } from '../utils'
import { db } from '../config'
import { getDegreeRepository } from '../repository'
import { IDegreeController } from '../../types/controller'

/** Degree API controller */
export class DegreeController implements IDegreeController {
  private degreeRepo = getDegreeRepository(db)

  /**
   * creates a Degree
   *
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
        res.json(flatten.degree(degree))
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }

  /**
   * list all degrees in the database
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    this.degreeRepo.find({ relations: { modules: true } }).then((results) => {
      res.json(results.map((degree) => flatten.degree(degree)))
    })
  }

  /**
   * hard-deletes one Degree by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    this.degreeRepo
      .delete({
        id: req.params.degreeId,
      })
      .then((deleteResult) => {
        res.json({ deleteResult })
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }
}
