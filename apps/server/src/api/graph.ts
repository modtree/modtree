import { Api } from '@modtree/repo-api'
import { CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request } from 'express'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

type GraphIds = {
  graphIds: string[] | string
}

export class GraphApi {
  /**
   * creates a Graph
   *
   * @param {Api} api
   */
  static create = (api: Api) => async (req: Request) => {
    const props = emptyInit.Graph
    copy(req.body, props)
    return api.graphRepo.initialize(props).then(flatten.graph)
  }

  /**
   * gets one Graph
   *
   * @param {Api} api
   */
  static get = (api: Api) => async (req: CustomReqQuery<ListRequest>) => {
    return api.graphRepo.findOneById(req.params.graphId).then(flatten.graph)
  }

  /**
   * lists all Graphs
   *
   * @param {Api} api
   */
  static list = (api: Api) => async (req: CustomReqQuery<GraphIds>) => {
    const graphIds = req.query.graphIds
    if (Array.isArray(graphIds)) {
      return api.graphRepo.findByIds(graphIds)
    } else if (graphIds.length > 0) {
      return api.graphRepo.findByIds([graphIds])
    } else {
      return []
    }
  }

  /**
   * hard-deletes a Graph
   *
   * @param {Api} api
   */
  static delete = (api: Api) => (req: Request) => {
    return api.graphRepo.delete({
      id: req.params.graphId,
    })
  }

  /**
   * finds a graph by its id and toggles one module code
   *
   * @param {Api} api
   */
  static toggle = (api: Api) => async (req: Request) => {
    const { moduleCode, graphId } = req.params
    return api.graphRepo
      .findOneById(graphId)
      .then((graph) => api.graphRepo.toggleModule(graph, moduleCode))
      .then(flatten.graph)
  }

  /**
   * finds a graph by its id and updates it with request props
   *
   * @param {Api} api
   */
  static updateFrontendProps = (api: Api) => async (req: Request) => {
    const { flowNodes, flowEdges } = req.body
    const { graphId } = req.params
    return api.graphRepo
      .findOneById(graphId)
      .then((graph) =>
        api.graphRepo.updateFrontendProps(graph, {
          flowEdges,
          flowNodes,
        })
      )
      .then(flatten.graph)
  }

  /**
   * finds a graph by its id and toggles one module code
   *
   * @param {Api} api
   */
  static suggestModules = (api: Api) => async (req: Request) => {
    const { graphId } = req.params
    const { selectedCodes } = req.body
    return api.graphRepo
      .findOneById(graphId)
      .then((graph) => api.graphRepo.suggestModules(graph, selectedCodes))
      .then((modules) => modules.map((m) => flatten.module(m)))
  }
}
