import { BaseApi } from './base-api'
import type { Modtree } from 'types'

export class DegreeApi extends BaseApi {
  /**
   * get a degree by its id directly from database
   */
  async getById(degreeId: string): Promise<Modtree.Degree> {
    return this.server.get(`/degree/${degreeId}`).then((res) => res.data)
  }
}
