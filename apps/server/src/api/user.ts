import { Api } from '@modtree/repos'
import { CustomReqBody, CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request } from 'express'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

export class UserApi {
  /**
   * creates a User
   *
   * @param {Api} api
   */
  static create = (api: Api) => async (req: Request) => {
    const props = emptyInit.User
    copy(req.body, props)
    return api.userRepo.initialize(props).then(flatten.user)
  }

  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static get = (api: Api) => async (req: CustomReqQuery<ListRequest>) => {
    return api.userRepo.findOneById(req.params.userId).then(flatten.user)
  }

  /**
   * gets one User by primary keys
   * at least one of id, authZeroId, or email
   *
   * UNUSED
   *
   * @param {Api} api
   */
  static getByPrimaryKeys =
    (api: Api) => async (req: CustomReqBody<ListRequest>) => {
      const { id, authZeroId, email } = req.body
      return api.userRepo
        .findOneOrFail({
          where: { id, authZeroId, email },
          relations: api.relations.user,
        })
        .then(flatten.user)
    }

  /**
   * lists all Users
   *
   * @param {Api} api
   */
  static list = (api: Api) => async (req: CustomReqQuery<ListRequest>) => {
    const { id, authZeroId, email } = req.query
    return api.userRepo
      .find({
        where: { id, authZeroId, email },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedDegrees: true,
          savedGraphs: true,
        },
      })
      .then((users) => users.map((u) => flatten.user(u)))
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
    return api.userRepo.findOneOrFail({
      where: { id: req.params.userId || '_' },
      relations: {
        modulesDone: true,
        modulesDoing: true,
        savedGraphs: {
          // does not fetch degree modules
          degree: true,
        },
        savedDegrees: {
          modules: true,
        },
        mainDegree: true,
        mainGraph: {
          // does not fetch degree modules
          degree: true,
        },
      },
    })
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
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
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
      .findOneOrFail({
        where: { id: userId },
        relations: api.relations.user,
      })
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
    return api.userLogin(authZeroId, email)
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
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
      .then((user) => api.userRepo.setModuleStatus(user, moduleCodes, status))
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
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
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
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
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
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
      .then((user) => api.userRepo.setMainGraph(user, graphId))
      .then(flatten.user)
  }
}
