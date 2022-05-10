import { AppDataSource, db } from './data-source'
import { ModuleCondensed, Module, ModuleCheck } from './entity'
import { log } from './cli'

export const listModuleCondensed = async (): Promise<Set<string>> => {
  await db.open()
  log.fname('listModuleCondensed')
  const existingModuleCodes = new Set<string>()
  const repo = AppDataSource.getRepository(ModuleCondensed)
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

export const listModules = async () => {
  await db.open()
  log.fname('listModules')
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

export const listModuleCheck = async (): Promise<Set<string>> => {
  await db.open()
  log.fname('listModuleCondensed')
  const existingModuleCodes = new Set<string>()
  const repo = AppDataSource.getRepository(ModuleCheck)
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
