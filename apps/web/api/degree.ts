import { IDegree, IModule } from '@modtree/types'
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
  async setModules(degreeId: string, moduleCodes: string[]): Promise<IDegree> {
    return this.server
      .patch(`/degree/${degreeId}`, { moduleCodes })
      .then((res) => res.data)
  }
  /**
   * create
   */
  async create(title: string, modules: IModule[]): Promise<IDegree> {
    const moduleCodes = modules.map((m) => m.moduleCode)
    return this.server
      .post(`/degree`, { title, moduleCodes })
      .then((res) => res.data)
  }
}
