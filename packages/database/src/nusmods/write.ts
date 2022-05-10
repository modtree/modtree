import { ModuleCondensed, Module } from '../entity'
import { AppDataSource, container } from '../data-source'

export namespace write {
  /**
   * writes a list of condensed modules to database
   * @param {ModuleCondensed[]} moduleList
   */
  export async function moduleCondensed(moduleList: ModuleCondensed[]) {
    container(async () => {
      console.debug('Importing a list of condensed modules...')
      await AppDataSource.manager.save(moduleList)
      console.log('Done saving.')
    })
  }

  /**
   * writes a list of complete modules to database
   * @param {Module[]} moduleList
   */
  export async function module(moduleList: Module[]) {
    container(async () => {
      console.debug('Importing a list of condensed modules...')
      await AppDataSource.manager.save(moduleList)
      console.log('Done saving.')
    })
  }
}
