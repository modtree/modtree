import { BaseApi } from './base-api'
import { IUser, ModtreeApiResponse, ModuleStatus, User } from '@modtree/types'
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
  async login(authZeroId: string, email: string): Promise<IUser> {
    return this.server
      .post(`/user/${authZeroId}/login`, {
        email,
      })
      .then((res) => {
        const user: IUser = res.data
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
  ) {
    return this.server.patch(`/user/${userId}/module`, {
      status,
      moduleCodes,
    })
  }

  /**
   * insert degree
   */
  async insertDegree(userId: string, degreeId: string): Promise<IUser> {
    return this.server.patch(`/user/${userId}/degree`, {
      degreeIds: [degreeId],
    })
  }

  /**
   * remove degree
   */
  async removeDegree(userId: string, degreeId: string): Promise<IUser> {
    return this.server.delete(`/user/${userId}/degree/${degreeId}`)
  }

  /**
   * set main graph
   */
  async setMainGraph(userId: string, graphId: string): Promise<IUser> {
    return this.server.patch(`/user/${userId}/main-graph`, {
      graphId,
    })
  }
}
