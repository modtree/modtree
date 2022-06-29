import { BaseApi } from './base-api'
import type { Modtree } from 'types'
import { ModuleStatus } from '@modtree/types'
import { setUser } from '@/store/user'

export class UserApi extends BaseApi {
  /**
   * get a user by its id directly from database
   *
   * @param {string} userId
   * @returns {Promise<Modtree.User>}
   */
  async getById(userId: string): Promise<Modtree.User> {
    return this.server.get(`/user/${userId}`).then((res) => res.data)
  }

  /**
   * login to modtree database
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<Modtree.User>}
   */
  async login(authZeroId: string, email: string): Promise<Modtree.User> {
    return this.server
      .post(`/user/${authZeroId}/login`, {
        email,
      })
      .then((res) => {
        const user: Modtree.User = res.data
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
}
