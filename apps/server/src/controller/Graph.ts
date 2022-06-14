import { Request, Response } from 'express'
import { IGraphController } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { db } from '@modtree/typeorm-config'
import { GraphRepository } from '@modtree/repo-graph'
import { validate } from './base'

/** Graph API controller */
export class GraphController implements IGraphController {
  private graphRepo = new GraphRepository(db)

  /**
   * creates a Graph
   *
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
    this.graphRepo
      .initialize(props)
      .then((graph) => {
        res.json(flatten.graph(graph))
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
    return this.graphRepo
      .findOneById(req.params.graphId)
      .then((graph) => {
        res.json(flatten.graph(graph))
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
    this.graphRepo
      .find({
        relations: {
          user: true,
          degree: true,
          modulesHidden: true,
          modulesPlaced: true,
        },
      })
      .then((results) => {
        const flat = results.map((graph) => flatten.graph(graph))
        res.json(flat)
      })
      .catch(() => {
        res.status(404).json({ message: 'Graphs not found' })
      })
  }

  /**
   * hard-deletes one Graph by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req: Request, res: Response) {
    this.graphRepo
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
   * finds a graph by its id and updates it with request props
   *
   * @param {Request} req
   * @param {Response} res
   */
  async toggle(req: Request, res: Response) {
    if (!validate(req, res)) return
    const { moduleCode, graphId } = req.params
    this.graphRepo
      .findOneById(graphId)
      .then((graph) => this.graphRepo.toggleModule(graph, moduleCode))
      .then((graph) => {
        res.json(flatten.graph(graph))
      })
      .catch(() => res.status(500).json({ message: 'Unable to toggle module' }))
  }

  /**
   * finds a graph by its id and updates it with request props
   *
   * @param {Request} req
   * @param {Response} res
   */
  async updateFrontendProps(req: Request, res: Response) {
    if (!validate(req, res)) return
    const { flowNodes, flowEdges } = req.body
    const { graphId } = req.params
    this.graphRepo
      .findOneById(graphId)
      .then((graph) =>
        this.graphRepo.updateFrontendProps(graph, {
          flowEdges,
          flowNodes,
        })
      )
      .then((graph) => {
        res.json(flatten.graph(graph))
      })
      .catch(() =>
        res.status(500).json({ message: 'Unable to update frontend props' })
      )
  }
}
