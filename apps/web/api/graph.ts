import {
  GraphFlowEdge,
  GraphFlowNode,
  IGraph,
  ModtreeApiResponse,
} from '@modtree/types'
import { BaseApi } from './base-api'

export class GraphApi extends BaseApi {
  /**
   * get a graph by its id directly from database
   */
  async getById(graphId: string): Promise<ModtreeApiResponse.GraphFull> {
    return this.server.get(`/graph/${graphId}`).then((res) => res.data)
  }

  /**
   * toggle module in graph
   */
  async toggle(
    graphId: string,
    moduleCode: string
  ): Promise<ModtreeApiResponse.GraphFull> {
    return this.server
      .patch(`/graph/${graphId}/toggle/${moduleCode}`)
      .then((res) => res.data)
  }

  /**
   * update frontend props
   */
  async updateFrontendProps(
    graphId: string,
    flowNodes: GraphFlowNode[],
    flowEdges: GraphFlowEdge[]
  ): Promise<ModtreeApiResponse.GraphFull> {
    return this.server
      .patch(`/graph/${graphId}/flow`, {
        flowNodes,
        flowEdges,
      })
      .then((res) => res.data)
  }
}
