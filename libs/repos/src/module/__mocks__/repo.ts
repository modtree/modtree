import { Module } from '@modtree/types'
import { DataSource } from 'typeorm'
import { ModuleRepository as Original } from '../repo'

export class ModuleRepository extends Original {
  constructor(db: DataSource) {
    super(db)
  }

  private moduleFromCode(moduleCode: string): Module {
    return Object.assign(new Module(), { moduleCode })
  }

  override async findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return moduleCodes.map(this.moduleFromCode)
  }

  override async findByCode(moduleCode: string): Promise<Module> {
    return this.moduleFromCode(moduleCode)
  }
}
