import { ModuleCondensed } from '@modtree/entity'
import { backend } from './backend'
import store, { AppDispatch } from '@/store/redux'
import { addModulesCondensedToCache } from '@/store/cache'

class ModuleCondensedCache {
  private codes: Set<string>
  private dispatch: AppDispatch
  constructor() {
    this.codes = new Set<string>()
    this.dispatch = store.dispatch
  }
  /**
   * updates the cache
   */
  async load(codes: string[]) {
    const moduleCodes = codes.filter((code) => !this.codes.has(code))
    return backend
      .get('/modules-condensed', {
        params: { moduleCodes },
      })
      .then((res) => {
        const modules: ModuleCondensed[] = res.data
        this.dispatch(addModulesCondensedToCache(modules))
        modules.forEach((module) => {
          this.codes.add(module.moduleCode)
        })
      })
  }
}

export const moduleCondensedCache = new ModuleCondensedCache()
