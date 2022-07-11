import { Module } from '@modtree/types'
import { DataSource } from 'typeorm'
import { ModuleRepository as Original } from '../repo'

export class ModuleRepository extends Original {
  private fakeDb: Record<string, Module>
  private meme: string
  constructor(db: DataSource, fakeDb?: Record<string, Partial<Module>>) {
    super(db, fakeDb)
    const data: Record<string, Module> = {}
    Object.entries(fakeDb || {}).forEach(([key, value]) => {
      data[key] = Object.assign(new Module(), value)
    })
    this.fakeDb = data
    this.meme = 'hello there'
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
    console.log(this.meme, this.fakeDb)
    return moduleCodes.map(this.moduleFromCode)
  }

  override async findByCode(moduleCode: string): Promise<Module> {
    return this.fetchOrFake(moduleCode)
  }
}
