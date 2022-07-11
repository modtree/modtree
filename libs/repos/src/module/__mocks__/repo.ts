import { Module } from '@modtree/types'
import { DataSource } from 'typeorm'
import { BaseRepo } from '../../base'

export class ModuleRepository extends BaseRepo<Module> {
  constructor(db: DataSource) {
    super(Module, db)
  }

  private moduleFromCode(moduleCode: string): Module {
    return Object.assign(new Module(), { moduleCode })
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  async findByCodes(moduleCodes: string[]): Promise<Module[]> {
    return moduleCodes.map(this.moduleFromCode)
  }
}
