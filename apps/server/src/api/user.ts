import { Api } from '@modtree/repo-api'
import { CustomReqBody, CustomReqQuery } from '@modtree/types'
import { validate } from '../validate'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request, Response } from 'express'

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
  static create = (api: Api) => (req: Request, res: Response) => {
    if (!validate(req, res)) return
    const props = emptyInit.User
    copy(req.body, props)
    api.userRepo
      .initialize(props)
      .then((user) => {
        res.json(flatten.user(user))
      })
      .catch(() => res.status(500))
  }

  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static get =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      api.userRepo
        .findOneById(req.params.userId)
        .then((user) => {
          res.json(flatten.user(user))
        })
        .catch(() => {
          res.status(404).json({ message: 'User not found' })
        })
    }

  /**
   * gets one User by primary keys
   * at least one of id, authZeroId, or email
   *
   * @param {Api} api
   */
  static getByPrimaryKeys =
    (api: Api) => (req: CustomReqBody<ListRequest>, res: Response) => {
      if (!validate(req, res)) return
      const { id, authZeroId, email } = req.body
      if ([id, authZeroId, email].every((x) => x === undefined)) {
        res
          .status(400)
          .json({ message: 'needs at least one of id, authZeroId, or email' })
      }
      api.userRepo
        .findOneOrFail({
          where: { id, authZeroId, email },
          relations: api.relations.user,
        })
        .then((user) => {
          res.json(flatten.user(user))
        })
    }

  /**
   * lists all Users
   *
   * @param {Api} api
   */
  static list =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      if (!validate(req, res)) return
      const { id, authZeroId, email } = req.query
      api.userRepo
        .find({
          where: { id, authZeroId, email },
          relations: {
            modulesDone: true,
            modulesDoing: true,
            savedDegrees: true,
            savedGraphs: true,
          },
        })
        .then((users) => {
          const flat = users.map((u) => flatten.user(u))
          res.json(flat)
        })
    }

  /**
   * hard-deletes a User
   *
   * @param {Api} api
   */
  static delete = (api: Api) => (req: Request, res: Response) => {
    api.userRepo
      .findOneById(req.params.userId)
      .then((user) => api.userRepo.remove(user))
      .then((deleteResult) => {
        res.json({ deleteResult })
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static getFull = (api: Api) => (req: Request, res: Response) => {
    api.userRepo
      .findOneOrFail({
        where: { id: req.params.userId || '_' },
        relations: {
          modulesDone: true,
          modulesDoing: true,
          savedDegrees: {
            modules: true,
          },
        },
      })
      .then((user) => {
        res.json(user)
      })
      .catch(() => {
        res.status(404).json({ message: 'User not found' })
      })
  }

  /**
   * inserts a degree into a User
   *
   * @param {Api} api
   */
  static insertDegrees = (api: Api) => (req: Request, res: Response) => {
    const id = req.params.userId
    const requestKeys = Object.keys(req.body)
    const requiredKeys = ['degreeIds']
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    const { degreeIds } = req.body
    api.userRepo
      .findOneOrFail({
        where: { id },
        relations: api.relations.user,
      })
      .then(
        (user) => api.userRepo.insertDegrees(user, degreeIds),
        (error) => {
          res.status(404).json({ message: 'User not found', error })
          throw new Error(error)
        }
      )
      .then(
        (userRes) => {
          if (!userRes) return res.status(400)
          res.json(flatten.user(userRes))
        },
        () => res.status(400)
      )
  }

  /**
   * handles user login
   *
   * @param {Api} api
   */
  static login = (api: Api) => (req: Request, res: Response) => {
    if (!validate(req, res)) return
    const authZeroId = req.params.authZeroId
    const { email } = req.body
    api
      .userLogin(authZeroId, email)
      .then((user) => {
        res.json(flatten.user(user))
      })
      .catch(() => {
        res.status(500)
      })
  }
}
