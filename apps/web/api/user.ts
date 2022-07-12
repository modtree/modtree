import { BaseApi } from './base-api'
import { ModtreeApiResponse, ModuleStatus } from '@modtree/types'
import { setUser } from '@/store/user'

export class UserApi extends BaseApi {
  /**
   * get a user by its id directly from database
   *
   * @param {string} userId
   * @returns {Promise<User>}
   */
  async getById(userId: string): Promise<ModtreeApiResponse.UserFull> {
    return this.server.get(`/user/${userId}/get-full`).then((res) => res.data)
  }

  /**
   * login to modtree database
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<User>}
   */
  async login(
    authZeroId: string,
    email: string
  ): Promise<ModtreeApiResponse.UserFull> {
    return this.server
      .post(`/user/${authZeroId}/login`, {
        email,
      })
      .then((res) => {
        const user: ModtreeApiResponse.UserFull = res.data
        this.dispatch(setUser(user))
        return user
      })
  }

  /**
   * update a module status (done/doing) of a user
   *
   */
  async setModuleStatus(
    userId: string,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<ModtreeApiResponse.User> {
    return this.server.patch(`/user/${userId}/module`, {
      status,
      moduleCodes,
    })
  }

  /**
   * insert degree
   */
  async insertDegree(
    userId: string,
    degreeId: string
  ): Promise<ModtreeApiResponse.User> {
    return this.server.patch(`/user/${userId}/degree`, {
      degreeIds: [degreeId],
    })
  }

  /**
   * remove degree
   */
  async removeDegree(
    userId: string,
    degreeId: string
  ): Promise<ModtreeApiResponse.User> {
    return this.server.delete(`/user/${userId}/degree/${degreeId}`)
  }

  /**
   * set main graph
   */
  async setMainGraph(
    userId: string,
    graphId: string
  ): Promise<ModtreeApiResponse.User> {
    return this.server.patch(`/user/${userId}/main-graph`, {
      graphId,
    })
  }

  /**
   * insert graph
   */
  async insertGraph(
    userId: string,
    graphId: string
  ): Promise<ModtreeApiResponse.User> {
    return this.server.patch(`/user/${userId}/graph`, {
      graphIds: [graphId],
    })
  }

  /**
   * can take modules
   */
  async canTakeModules(
    userId: string,
    moduleCodes: string[]
  ): Promise<Record<string, boolean>> {
    return this.server
      .post(`/user/${userId}/can-take-modules`, {
        moduleCodes,
      })
      .then((res) => res.data)
  }
}
