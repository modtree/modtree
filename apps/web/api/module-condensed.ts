import { addModulesCondensedToCache } from '@/store/cache'
import { BaseApi } from './base-api'
import type { Modtree } from 'types'

export class ModuleCondensedApi extends BaseApi {
  /**
   * updates the cache with any new modules found
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<void>}
   */
  async loadCodes(moduleCodes: string[]): Promise<void> {
    /** read redux state to gather existing codes */
    const existingCodes = new Set(
      Object.keys(this.redux().cache.modulesCondensed)
    )
    /** get a list of codes to actually fetch */
    const codesToFetch = moduleCodes.filter((code) => !existingCodes.has(code))
    if (codesToFetch.length === 0) return
    /** send the http request */
    return this.server
      .get('/modules-condensed', {
        params: { moduleCodes: codesToFetch },
      })
      .then((res) => {
        const modules: Modtree.ModuleCondensed[] = res.data
        /** update the redux store */
        this.dispatch(addModulesCondensedToCache(modules))
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
      moduleCodes.map((code) => this.redux().cache.modulesCondensed[code])
    )
  }
}
