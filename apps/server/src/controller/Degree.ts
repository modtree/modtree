import { Request, Response } from 'express'
import { IDegreeController } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { db } from '@modtree/typeorm-config'
import { DegreeRepository } from '@modtree/repo-degree'

/** Degree API controller */
export class DegreeController implements IDegreeController {
  private degreeRepo = new DegreeRepository(db)

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
      res.json(flatten.degree(degree))
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
      .findOneById(req.params.id)
      .then((degree) => this.degreeRepo.remove(degree))
      .then((degree) => {
        res.json(flatten.degree(degree))
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }
}
