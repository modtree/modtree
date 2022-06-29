import { ModuleCondensed } from '@modtree/entity'
import { backend } from './backend'
import store from '@/store/redux'
import { addModulesCondensedToCache } from '@/store/cache'

class ModuleCondensedCache {
  private data: Record<string, ModuleCondensed>
  constructor() {
    this.data = store.getState().cache.modulesCondensed
  }
  /**
   * updates the cache with a list of module codes
   * duplicates will be removed and not queried for
   */
  async load(codes: string[]) {
    const existingCodes = new Set(Object.keys(this.data))
    const moduleCodes = codes.filter((code) => !existingCodes.has(code))
    return backend
      .get('/modules-condensed', {
        params: { moduleCodes },
      })
      .then((res) => {
        const modules: ModuleCondensed[] = res.data
        store.dispatch(addModulesCondensedToCache(modules))
      })
  }
}

export const moduleCondensedCache = new ModuleCondensedCache()
