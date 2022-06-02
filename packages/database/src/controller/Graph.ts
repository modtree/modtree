import { Request, Response } from 'express'
import { copy } from '../utils'
import { db } from '../config'
import { Graph } from '../entity'
import { GraphRepository } from '../repository'
import { emptyInit } from '../utils/empty'
import { response } from '../../types/api-response'

/**
 * flattens a graph to response shape
 * @param {Graph} graph
 * @return {response.Graph}
 */
function flatten(graph: Graph): response.Graph {
  return {
    id: graph.id,
    user: graph.user.id,
    degree: graph.degree.id,
    modulesHidden: graph.modulesHidden.map((m) => m.moduleCode),
    modulesPlaced: graph.modulesHidden.map((m) => m.moduleCode),
  }
}

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
        res.json(flatten(graph))
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
    const flat = results.map((graph) => flatten(graph))
    res.json(flat)
  }
}
