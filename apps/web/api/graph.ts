import { GraphFlowEdge, GraphFlowNode, IGraph } from '@modtree/types'
import { BaseApi } from './base-api'

export class GraphApi extends BaseApi {
  /**
   * get a graph by its id directly from database
   */
  async getById(graphId: string): Promise<IGraph> {
    return this.server.get(`/graph/${graphId}`).then((res) => res.data)
  }

  /**
   * toggle module in graph
   */
  async toggle(graphId: string, moduleCode: string): Promise<IGraph> {
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
  ): Promise<IGraph> {
    return this.server
      .patch(`/graph/${graphId}/flow`, {
        flowNodes,
        flowEdges,
      })
      .then((res) => res.data)
  }
}
