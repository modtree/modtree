import { IGraph } from '@modtree/types'
import { BaseApi } from './base-api'

export class GraphApi extends BaseApi {
  /**
   * get a graph by its id directly from database
   */
  async getById(graphId: string): Promise<IGraph> {
    return this.server.get(`/graph/${graphId}`).then((res) => res.data)
  }
}
