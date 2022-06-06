import { Request, Response } from 'express'
import { copy, EmptyInit, Flatten } from '../utils'
import { db } from '../config'
import { GraphRepository } from '../repository'
import { IGraphController } from '../../types/controller'

/** Graph API controller */
export class GraphController implements IGraphController {
  private graphRepo = GraphRepository(db)

  /**
   * creates a Graph
   *
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = EmptyInit.Graph
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    await this.graphRepo
      .initialize(props)
      .then((graph) => {
        res.json(graph)
      })
      .catch(() => {
        res
          .status(400)
          .json({ message: 'invalid ids', requestKeys, requiredKeys })
        
      })
  }

  /**
   * finds one Graph by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async get(req: Request, res: Response) {
    this.graphRepo
      .findOne({
        where: { id: req.params.graphId },
        relations: {
          user: true,
          degree: true,
          modulesHidden: true,
          modulesPlaced: true,
        },
      })
      .then((graph) => {
        res.json(Flatten.graph(graph))
      })
      .catch(() => {
        res.status(404).json({ message: 'Graph not found' })
      })
  }

  /**
   * hard-deletes one Graph by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    await this.graphRepo
      .delete({
        id: req.params.graphId,
      })
      .then((deleteResult) => {
        res.json({ deleteResult })
      })
      .catch(() => {
        res.status(404).json({ message: 'Graph not found' })
      })
  }

  /**
   * list all graphs in the database
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    await this.graphRepo
      .find({
        relations: {
          user: true,
          degree: true,
          modulesHidden: true,
          modulesPlaced: true,
        },
      })
      .then((results) => {
        const flat = results.map((graph) => Flatten.graph(graph))
        res.json(flat)
        
      })
      .catch(() => {
        res.status(404).json({ message: 'Graphs not found' })
      })
  }
}
