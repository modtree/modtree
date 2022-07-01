import { Api } from '@modtree/repo-api'
import { CustomReqQuery } from '@modtree/types'
import { copy, emptyInit, flatten } from '@modtree/utils'
import { Request } from 'express'

type DegreeIds = {
  degreeIds: string[] | string
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
  static get = (api: Api) => async (req: Request) => {
    return api.degreeRepo.findOneById(req.params.degreeId).then(flatten.degree)
  }

  /**
   * gets one full Degree
   *
   * @param {Api} api
   */
  static getFull = (api: Api) => async (req: Request) => {
    return api.degreeRepo.findOneOrFail({
      where: { id: req.params.degreeId },
      relations: api.relations.degree,
    })
  }

  /**
   * lists all Degrees
   *
   * @param {Api} api
   */
  static list = (api: Api) => async (req: CustomReqQuery<DegreeIds>) => {
    const degreeIds = req.query.degreeIds
    if (Array.isArray(degreeIds)) {
      return api.degreeRepo.findByIds(degreeIds)
    } else if (degreeIds.length > 0) {
      return api.degreeRepo.findByIds([degreeIds])
    } else {
      return []
    }
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

  /**
   * inserts modules into a Degree
   *
   * @param {Api} api
   */
  static insertModules = (api: Api) => async (req: Request) => {
    const id = req.params.degreeId
    const { moduleCodes } = req.body
    return api.degreeRepo
      .findOneById(id)
      .then((degree) => api.degreeRepo.insertModules(degree, moduleCodes))
  }
}
