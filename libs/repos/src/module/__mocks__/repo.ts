import { Module } from '@modtree/types'
import { DataSource } from 'typeorm'
import { ModuleRepository as Original } from '../repo'

const moduleFromCode = (moduleCode: string): Module => {
  return Object.assign(new Module(), { moduleCode })
}

const fetchOrFake = (code: string, data: Record<string, Module>): Module => {
  return Object.keys(data).includes(code) ? data[code] : moduleFromCode(code)
}

export class ModuleRepository extends Original {
  private fakeData: Record<string, Module>
  constructor(db: DataSource, fakeData?: Record<string, Partial<Module>>) {
    super(db)
    const data: Record<string, Module> = {}
    Object.entries(fakeData || {}).forEach(([key, value]) => {
      data[key] = Object.assign(new Module(), value)
    })
    this.fakeData = data
  }

  override async findByCodes(codes: string[]): Promise<Module[]> {
    return codes.map((c) => fetchOrFake(c, this.fakeData))
  }

  override async findByCode(code: string): Promise<Module> {
    return fetchOrFake(code, this.fakeData)
  }
}
