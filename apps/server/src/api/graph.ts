import { Api } from '@modtree/repo-api'
import { CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request, Response } from 'express'
import { validate } from '../validate'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

export class GraphApi {
  /**
   * creates a Graph
   *
   * @param {Api} api
   */
  static create = (api: Api) => (req: Request, res: Response) => {
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
    api.graphRepo
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
   * gets one Graph
   *
   * @param {Api} api
   */
  static get =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      if (!validate(req, res)) return
      api.graphRepo
        .findOneById(req.params.graphId)
        .then((graph) => {
          res.json(flatten.graph(graph))
        })
        .catch(() => {
          res.status(404).json({ message: 'Graph not found' })
        })
    }

  /**
   * lists all Graphs
   *
   * @param {Api} api
   */
  static list =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      if (!validate(req, res)) return
      api.graphRepo.find({ relations: api.relations.graph }).then((results) => {
        res.json(results.map((graph) => flatten.graph(graph)))
      })
    }

  /**
   * hard-deletes a Graph
   *
   * @param {Api} api
   */
  static delete = (api: Api) => (req: Request, res: Response) => {
    api.graphRepo
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
   * finds a graph by its id and toggles one module code
   *
   * @param {Api} api
   */
  static toggle = (api: Api) => (req: Request, res: Response) => {
    if (!validate(req, res)) return
    const { moduleCode, graphId } = req.params
    api.graphRepo
      .findOneById(graphId)
      .then((graph) => api.graphRepo.toggleModule(graph, moduleCode))
      .then((graph) => {
        res.json(flatten.graph(graph))
      })
      .catch(() => res.status(500).json({ message: 'Unable to toggle module' }))
  }

  /**
   * finds a graph by its id and updates it with request props
   *
   * @param {Api} api
   */
  static updateFrontendProps = (api: Api) => (req: Request, res: Response) => {
    if (!validate(req, res)) return
    const { flowNodes, flowEdges } = req.body
    const { graphId } = req.params
    api.graphRepo
      .findOneById(graphId)
      .then((graph) =>
        api.graphRepo.updateFrontendProps(graph, {
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
