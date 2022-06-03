import { Request, Response } from 'express'
import { copy , emptyInit, flatten } from '../utils'
import { db } from '../config'
import { GraphRepository } from '../repository'

/** Graph API controller */
export class graphController {
  private graphRepo = GraphRepository(db)

  /**
   * creates a Graph
   * @param {Request} req
   * @param {Response} res
   */
  async create(req: Request, res: Response) {
    const props = emptyInit.Graph
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    const graph = await this.graphRepo.initialize(props)
    res.json(graph)
  }

  /**
   * finds one Graph by id
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
        res.json(flatten.graph(graph))
      })
      .catch(() => {
        res.status(404).json({ message: 'Graph not found' })
      })
  }

  /**
   * hard-deletes one Graph by id
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    const deleteResult = await this.graphRepo.delete({
      id: req.params.graphId,
    })
    res.json({ deleteResult })
  }

  /**
   * list all graphs in the database
   * @param {Request} req
   * @param {Response} res
   */
  async list(req: Request, res: Response) {
    const results = await this.graphRepo.find({
      relations: {
        user: true,
        degree: true,
        modulesHidden: true,
        modulesPlaced: true,
      },
    })
    const flat = results.map((graph) => flatten.graph(graph))
    res.json(flat)
  }
}
