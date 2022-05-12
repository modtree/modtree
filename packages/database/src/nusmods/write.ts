import { ModuleCondensed, Module } from '../entity'
import { AppDataSource, container2, db } from '../data-source'

export namespace write {
  /**
   * writes a list of condensed modules to database
   * @param {ModuleCondensed[]} moduleList
   */
  export async function moduleCondensed(moduleList: ModuleCondensed[]) {
    await db.open()
    console.debug('Importing a list of condensed modules...')
    await AppDataSource.manager.save(moduleList)
    console.log('Done saving.')
    await db.close()
  }

  /**
   * writes a list of complete modules to database
   * @param {Module[]} moduleList
   */
  export async function module(moduleList: Module[]) {
    container2(async () => {
      console.debug('Importing a list of condensed modules...')
      await AppDataSource.manager.save(moduleList)
      console.log('Done saving.')
    })
  }
}
