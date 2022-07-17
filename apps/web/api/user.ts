import { BaseApi } from './base-api'
import { ModtreeApiResponse, ModuleStatus } from '@modtree/types'
import { setUser } from '@/store/user'
import { trpc } from '@/utils/trpc'
import { updateUser } from '@/utils/rehydrate'

export class UserApi extends BaseApi {
  /**
   * get a user by its id directly from database
   *
   * @param {string} userId
   * @returns {Promise<User>}
   */
  async getById(userId: string): Promise<ModtreeApiResponse.User> {
    return trpc.query('user/get-full', userId)
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
  ): Promise<ModtreeApiResponse.User> {
    return trpc.mutation('user/login', { authZeroId, email }).then((user) => {
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
    return trpc
      .mutation('user/set-module-status', {
        userId,
        moduleCodes,
        status,
      })
      .then((res) => {
        updateUser()
        return res
      })
  }

  /**
   * insert degree
   */
  async insertDegree(
    userId: string,
    degreeId: string
  ): Promise<ModtreeApiResponse.User> {
    return trpc.mutation('user/insert-degrees', {
      userId,
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
    return trpc.mutation('user/remove-degree', { userId, degreeId })
  }

  /**
   * set main graph
   */
  async setMainGraph(userId: string, graphId: string): Promise<void> {
    return trpc
      .mutation('user/set-main-graph', { userId, graphId })
      .then(() => {
        updateUser()
      })
  }

  /**
   * insert graph
   */
  async insertGraph(
    userId: string,
    graphId: string
  ): Promise<ModtreeApiResponse.User> {
    return trpc.mutation('user/insert-graphs', { userId, graphIds: [graphId] })
  }

  /**
   * remove degree
   */
  async removeGraph(
    userId: string,
    graphId: string
  ): Promise<ModtreeApiResponse.User> {
    return trpc.mutation('user/remove-graph', { userId, graphId })
  }
}
