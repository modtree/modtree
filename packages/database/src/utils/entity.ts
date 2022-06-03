import { Module, ModuleCondensed } from '../entity'

export class flatten {
  /**
   * flattens a module to its module code
   */
  module(m: Module | ModuleCondensed): string {
    return m.moduleCode
  }

}
