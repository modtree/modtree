import { Api } from '@modtree/repos'
import { CustomReqQuery } from '@modtree/types'
import { emptyInit, flatten } from '@modtree/utils'
import { Request } from 'express'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

export class UserApi {
  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static get = (api: Api) => async (req: CustomReqQuery<ListRequest>) => {
    return api.userRepo.findOneById(req.params.userId).then(flatten.user)
  }

  /**
   * creates a User
   *
   * @param {Api} api
   */
  static create = (api: Api) => async (req: Request) => {
    const props = { ...emptyInit.User, ...req.body }
    return api.userRepo.initialize(props).then(flatten.user)
  }

  /**
   * lists all Users
   *
   * @param {Api} api
   */
  static list = (api: Api) => async (req: any) => {
    const { id, authZeroId, email } = req.query
    return api.userRepo
      .find({
        where: { id, authZeroId, email },
        relations: api.userRepo.relations,
      })
      .then((users) => users.map(flatten.user))
  }

  /**
   * hard-deletes a User
   *
   * @param {Api} api
   */
  static delete = (api: Api) => async (req: Request) => {
    return api.userRepo
      .findOneById(req.params.userId)
      .then((user) => api.userRepo.remove(user))
  }

  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static getFull = (api: Api) => async (req: Request) => {
    return api.userRepo
      .findOne({
        where: { id: req.params.userId || '_' },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedGraphs: true,
          savedDegrees: {
            modules: true,
          },
          mainDegree: true,
          mainGraph: true,
        },
      })
      .then(flatten.user)
  }

  /**
   * inserts a degree into a User
   *
   * @param {Api} api
   */
  static insertDegrees = (api: Api) => async (req: Request) => {
    const id = req.params.userId
    const { degreeIds } = req.body
    return api.userRepo
      .findOneById(id)
      .then((user) => api.userRepo.insertDegrees(user, degreeIds))
      .then(flatten.user)
  }

  /**
   * removes a degree from a User
   *
   * @param {Api} api
   */
  static removeDegree = (api: Api) => async (req: Request) => {
    const { userId, degreeId } = req.params
    return api.userRepo
      .findOneById(userId)
      .then((user) => api.userRepo.removeDegree(user, degreeId))
      .then(flatten.user)
  }

  /**
   * handles user login
   *
   * @param {Api} api
   */
  static login = (api: Api) => async (req: Request) => {
    const authZeroId = req.params.authZeroId
    const { email } = req.body
    return api.userLogin(authZeroId, email).then(flatten.user)
  }

  /**
   * set module status of multiple modules of a user
   *
   * @param {Api} api
   */
  static setModuleStatus = (api: Api) => async (req: Request) => {
    const id = req.params.userId
    const { moduleCodes, status } = req.body
    return api.userRepo
      .findOneById(id)
      .then((user) => api.userRepo.setModuleStatus(user, moduleCodes, status))
      .then(flatten.user)
  }

  /**
   * inserts a graph into a User
   *
   * @param {Api} api
   */
  static insertGraphs = (api: Api) => async (req: Request) => {
    const id = req.params.userId
    const { graphIds } = req.body
    return api.userRepo
      .findOneById(id)
      .then((user) => api.userRepo.insertGraphs(user, graphIds))
      .then(flatten.user)
  }

  /**
   * Sets the main degree of a user.
   *
   * If the degree is not in savedDegrees, fails.
   *
   * @param {Api} api
   */
  static setMainDegree = (api: Api) => async (req: Request) => {
    const id = req.params.userId
    const { degreeId } = req.body
    return api.userRepo
      .findOneById(id)
      .then((user) => api.userRepo.setMainDegree(user, degreeId))
      .then(flatten.user)
  }

  /**
   * Sets the main graph of a user.
   *
   * If the graph is not in savedGraphs, fails.
   * If the graph's degree is not in savedDegrees, fails.
   *
   * @param {Api} api
   */
  static setMainGraph = (api: Api) => async (req: Request) => {
    const id = req.params.userId
    const { graphId } = req.body
    return api.userRepo
      .findOneById(id)
      .then((user) => api.userRepo.setMainGraph(user, graphId))
      .then(flatten.user)
  }
}
