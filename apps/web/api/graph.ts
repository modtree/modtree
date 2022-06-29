import { BaseApi } from './base-api'
import type { Modtree } from 'types'

export class GraphApi extends BaseApi {
  /**
   * get a graph by its id directly from database
   */
  async getById(graphId: string): Promise<Modtree.Graph> {
    return this.server.get(`/graph/${graphId}`).then((res) => res.data)
  }
}
