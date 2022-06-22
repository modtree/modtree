import { Api } from '@modtree/repo-api'
import { CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request } from 'express'

type ListRequest = {
  id?: string
  authZeroId?: string
  email?: string
}

export class DegreeApi {
  /**
   * creates a Degree
   *
   * @param {Api} api
   */
  static create = (api: Api) => async (req: Request) => {
    const props = emptyInit.Degree
    copy(req.body, props)
    return api.degreeRepo.initialize(props).then(flatten.degree)
  }

  /**
   * gets one Degree
   *
   * @param {Api} api
   */
  static get = (api: Api) => async (req: CustomReqQuery<ListRequest>) => {
    return api.degreeRepo.findOneById(req.params.degreeId).then(flatten.degree)
  }

  /**
   * lists all Degrees
   *
   * @param {Api} api
   */
  static list = (api: Api) => async () => {
    return api.degreeRepo
      .find({ relations: { modules: true } })
      .then((results) => results.map((degree) => flatten.degree(degree)))
  }

  /**
   * hard-deletes a Degree
   *
   * @param {Api} api
   */
  static delete = (api: Api) => async (req: Request) => {
    return api.degreeRepo
      .findOneById(req.params.degreeId)
      .then((degree) => api.degreeRepo.remove(degree))
      .then(flatten.degree)
  }
}
