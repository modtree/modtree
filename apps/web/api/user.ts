import { BaseApi } from './base-api'
import type { Modtree } from 'types'
import { ModuleStatus } from '@modtree/types'

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
