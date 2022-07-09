import { IDegree, InitDegreeProps } from '@modtree/types'
import { BaseApi } from './base-api'

export class DegreeApi extends BaseApi {
  /**
   * get a degree by its id directly from database
   */
  async getById(degreeId: string): Promise<IDegree> {
    return this.server
      .get(`/degree/${degreeId}/get-full`)
      .then((res) => res.data)
  }
  /**
   * sets modules
   */
  async modify(degreeId: string, props: InitDegreeProps): Promise<IDegree> {
    return this.server
      .patch(`/degree/${degreeId}`, props)
      .then((res) => res.data)
  }
  /**
   * create
   */
  async create(props: InitDegreeProps): Promise<IDegree> {
    return this.server.post(`/degree`, props).then((res) => res.data)
  }
}
