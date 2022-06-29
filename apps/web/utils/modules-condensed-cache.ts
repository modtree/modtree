import { ModuleCondensed } from '@modtree/entity'
import { backend } from './backend'

class ModuleCondensedCache {
  private data: Record<string, ModuleCondensed>
  private codes: Set<string>
  constructor() {
    this.data = {}
    this.codes = new Set<string>()
  }
  async preload(codes: string[]): Promise<ModuleCondensed[]> {
    const moduleCodes = codes.filter((code) => this.codes.has(code))
    return backend
      .get('/modules-condensed', {
        params: { moduleCodes },
      })
      .then((res) => {
        const modules: ModuleCondensed[] = res.data
        modules.forEach((module) => {
          this.codes.add(module.moduleCode)
          this.data[module.moduleCode] = module
        })
        return modules
      })
  }
  async getOne(code: string): Promise<ModuleCondensed> {
    if (this.codes.has(code)) {
      return this.data[code]
    } else {
      return this.preload([code]).then((res) => res[0])
    }
  }
  async getList(codes: string[]): Promise<ModuleCondensed[]> {
    const toLoad = codes.filter((code) => !this.codes.has(code))
    return this.preload(toLoad).then(() => codes.map((code) => this.data[code]))
  }
}

export const moduleCondensedCache = new ModuleCondensedCache()
