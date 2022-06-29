import type { ModtreeApiResponse as Modtree } from '@modtree/types'
import axios from 'axios'
import store from '@/store/redux'
import { addModulesCondensedToCache } from '@/store/cache'

const redux = store.getState
const dispatch = store.dispatch

export const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

class DegreeApi {
  /**
   * get a degree by its id directly from database
   */
  async getById(degreeId: string): Promise<Modtree.Degree> {
    return server.get(`/degree/${degreeId}`).then((res) => res.data)
  }
}

class ModuleCondensedApi {
  /**
   * updates the cache with any new modules found
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<void>}
   */
  async loadCodes(moduleCodes: string[]): Promise<void> {
    /** read redux state to gather existing codes */
    const existingCodes = new Set(Object.keys(redux().cache.modulesCondensed))
    /** get a list of codes to actually fetch */
    const codesToFetch = moduleCodes.filter((code) => !existingCodes.has(code))
    if (codesToFetch.length === 0) return
    /** send the http request */
    return server
      .get('/modules-condensed', {
        params: { moduleCodes: codesToFetch },
      })
      .then((res) => {
        const modules: Modtree.ModuleCondensed[] = res.data
        /** update the redux store */
        dispatch(addModulesCondensedToCache(modules))
      })
  }

  /**
   * gets an array of condensed modules, memoized by redux cache
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<Modtree.ModuleCondensed[]>}
   */
  async getByCodes(moduleCodes: string[]): Promise<Modtree.ModuleCondensed[]> {
    /** update redux cache */
    return this.loadCodes(moduleCodes).then(() =>
      /**  then read from the updated copy */
      moduleCodes.map((code) => redux().cache.modulesCondensed[code])
    )
  }
}

export const api = {
  degree: new DegreeApi(),
  moduleCondensed: new ModuleCondensedApi(),
}
