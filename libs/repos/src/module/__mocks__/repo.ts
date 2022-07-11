import { Module } from '@modtree/types'
import { DataSource } from 'typeorm'
import { ModuleRepository as Original } from '../repo'

export class ModuleRepository extends Original {
  fakeDb: Record<string, Module>
  constructor(db: DataSource, fakeDb?: Record<string, Partial<Module>>) {
    super(db)
    Object.entries(fakeDb || {}).forEach(([key, value]) => {
      this.fakeDb[key] = Object.assign(new Module(), value)
    })
  }

  private moduleFromCode(moduleCode: string): Module {
    return Object.assign(new Module(), { moduleCode })
  }

  private fetchOrFake(code: string): Module {
    return Object.keys(this.fakeDb).includes(code)
      ? this.fakeDb[code]
      : this.moduleFromCode(code)
  }

  override async findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return moduleCodes.map(this.fetchOrFake)
  }

  override async findByCode(moduleCode: string): Promise<Module> {
    return this.fetchOrFake(moduleCode)
  }
}
