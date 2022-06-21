import { Api } from '@modtree/repo-api'
import { CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request, Response } from 'express'
import { validate } from '../validate'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

export class DegreeController {
  /**
   * creates a User
   *
   * @param {Api} api
   */
  static create = (api: Api) => (req: Request, res: Response) => {
    const props = emptyInit.Degree
    const requestKeys = Object.keys(req.body)
    const requiredKeys = Object.keys(props)
    if (!requiredKeys.every((val) => requestKeys.includes(val))) {
      res
        .status(400)
        .json({ message: 'insufficient keys', requestKeys, requiredKeys })
      return
    }
    copy(req.body, props)
    api.degreeRepo.initialize(props).then((degree) => {
      res.json(flatten.degree(degree))
    })
  }

  /**
   * gets one User by id
   *
   * @param {Api} api
   */
  static get =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      api.degreeRepo
        .findOneById(req.params.degreeId)
        .then((degree) => {
          res.json(flatten.degree(degree))
        })
        .catch(() => {
          res.status(404).json({ message: 'Degree not found' })
        })
    }

  /**
   * get all Users
   *
   * @param {Api} api
   */
  static list =
    (api: Api) => (req: CustomReqQuery<ListRequest>, res: Response) => {
      if (!validate(req, res)) return
      api.degreeRepo.find({ relations: { modules: true } }).then((results) => {
        res.json(results.map((degree) => flatten.degree(degree)))
      })
    }

  /**
   * hard-deletes a User by id
   *
   * @param {Api} api
   */
  static delete = (api: Api) => (req: Request, res: Response) => {
    api.degreeRepo
      .findOneById(req.params.degreeId)
      .then((degree) => api.degreeRepo.remove(degree))
      .then((degree) => {
        res.json(flatten.degree(degree))
      })
      .catch(() => {
        res.status(404).json({ message: 'Degree not found' })
      })
  }
}
