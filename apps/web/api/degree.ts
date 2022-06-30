import { IDegree } from '@modtree/types'
import { BaseApi } from './base-api'

export class DegreeApi extends BaseApi {
  /**
   * get a degree by its id directly from database
   */
  async getById(degreeId: string): Promise<IDegree> {
    return this.server.get(`/degree/${degreeId}`).then((res) => res.data)
  }
}
