import { addModulesToCache } from '@/store/cache'
import { addToBuildList, setBuildList } from '@/store/search'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'
import { InitDegreeProps, ModtreeApiResponse } from '@modtree/types'

import { BaseApi } from './base-api'

export class DegreeApi extends BaseApi {
  /**
   * get a degree by its id directly from database
   */
  async getById(degreeId: string): Promise<ModtreeApiResponse.Degree> {
    return trpc.query('degree', degreeId)
  }

  /**
   * sets modules
   */
  async modify(degreeId: string, props: InitDegreeProps): Promise<void> {
    return trpc.mutation('degree/modify', { degreeId, ...props }).then(() => {
      updateUser()
    })
  }

  /**
   * create
   */
  async create(props: InitDegreeProps): Promise<ModtreeApiResponse.Degree> {
    return trpc.mutation('degree/create', props)
  }

  /**
   * sets frontend current build target
   */
  async setBuildTarget(degreeId: string) {
    return trpc.query('degree/get-full', degreeId).then((degree) => {
      this.dispatch(addModulesToCache(degree.modules))
      this.dispatch(setBuildList(degree.modules.map((m) => m.moduleCode)))
    })
  }

  /**
   * adds a module to build list
   */
  async addToBuildList(moduleCode: string) {
    return trpc.query('module', moduleCode).then((module) => {
      this.dispatch(addModulesToCache([module]))
      this.dispatch(addToBuildList(moduleCode))
    })
  }
}
