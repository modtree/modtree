import { AppDataSource, db } from './data-source'
import { ModuleCondensed, Module } from './entity'
import { log } from './cli'
import { container2 } from './data-source'
import { config } from './config'

export namespace list {
  export const moduleCode = async (): Promise<Set<string>> => {
    const existingModuleCodes = new Set<string>()
    const res = await container2(async () => {
      const repo = AppDataSource.getRepository(ModuleCondensed)
      const db = config.database
      log.yellow(`retrieving module codes from ${db}.moduleCondensed`)
      let length = 0
      await repo
        .find()
        .then((modules) => {
          length = modules.length
          modules.forEach((module) => {
            existingModuleCodes.add(module.moduleCode)
          })
        })
        .catch((err) => {
          console.log(err)
          log.red('Unable to search for modules in its repo.')
        })
      return { length }
    })
    console.debug('total data sets:', res.length)
    console.debug('unique data:', existingModuleCodes.size)
    console.log('first 20:', Array.from(existingModuleCodes).slice(0, 20))
    return existingModuleCodes
  }

  export const module = async () => {
    await db.open()
    const existingModuleCodes = new Set<string>()
    const repo = AppDataSource.getRepository(Module)
    console.log('Loading modules from the database...')
    const modules = await repo.find()
    modules.forEach((m) => {
      existingModuleCodes.add(m.moduleCode)
    })
    console.debug('total data sets:', modules.length)
    console.debug('unique data:', existingModuleCodes.size)
    await db.close()
    return existingModuleCodes
  }
}
