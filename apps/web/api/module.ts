import { addModulesToCache } from '@/store/cache'
import { BaseApi } from './base-api'
import type { Modtree } from 'types'
import { setModalModule, showModuleModal } from '@/store/modal'

/**
 * NOTE TO DEVS
 *
 * it seems like modules are really heavy, seeing as redux sends warnings about
 * how slow operations with it are.
 *
 * For that reason, caching is to be avoided with modules in particular.
 */

export class ModuleApi extends BaseApi {
  /**
   * updates the cache with any new modules found
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<void>}
   */
  async loadCodes(moduleCodes: string[]): Promise<void> {
    /** read redux state to gather existing codes */
    const existingCodes = new Set(Object.keys(this.redux().cache.modules))
    /** get a list of codes to actually fetch */
    const codesToFetch = moduleCodes.filter((code) => !existingCodes.has(code))
    if (codesToFetch.length === 0) return
    /** send the http request */
    return this.server
      .get('/modules', {
        params: { moduleCodes: codesToFetch },
      })
      .then((res) => {
        const modules: Modtree.Module[] = res.data
        /** update the redux store */
        this.dispatch(addModulesToCache(modules))
      })
  }

  /**
   * gets an array of modules, memoized by redux cache
   *
   * @param {string[]} moduleCodes
   * @returns {Promise<Modtree.Module[]>}
   */
  async getByCodes(moduleCodes: string[]): Promise<Modtree.Module[]> {
    /** update redux cache */
    return this.loadCodes(moduleCodes).then(() =>
      /**  then read from the updated copy */
      moduleCodes.map((code) => this.redux().cache.modules[code])
    )
  }

  /**
   * gets one module, memoized by redux cache
   *
   * @param {string} moduleCode
   * @returns {Promise<Modtree.Module>}
   */
  async getByCode(moduleCode: string): Promise<Modtree.Module> {
    /** update redux cache */
    return this.loadCodes([moduleCode]).then(
      /**  then read from the updated copy */
      () => this.redux().cache.modules[moduleCode]
    )
  }

  /**
   * gets one module
   *
   * @param {string} moduleCode
   * @returns {Promise<Modtree.Module>}
   */
  async directGetByCode(moduleCode: string): Promise<Modtree.Module> {
    return this.server.get(`/module/${moduleCode}`).then((res) => res.data)
  }

  /**
   * opens the module modal with information about specified code
   *
   * @param {string} moduleCode
   */
  async openModuleModal(moduleCode: string) {
    this.dispatch(showModuleModal())
    return this.directGetByCode(moduleCode).then((module) =>
      this.dispatch(setModalModule(module))
    )
  }
}
