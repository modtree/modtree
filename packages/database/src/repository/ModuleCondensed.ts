import { ModuleCondensed } from '../entity-repo/ModuleCondensed'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { AppDataSource } from '../data-source'
import axios from 'axios'
import { nusmodsApi , getModuleLevel } from '../utils/string'

const Repository = AppDataSource.getRepository(ModuleCondensed)

/**
 * a drop-in replacement of a constructor
 * @param {NM} props
 * @return {Module}
 */
function build(props: NMC): ModuleCondensed {
  const m = new ModuleCondensed()
  m.moduleCode = props.moduleCode
  m.title = props.title
  m.moduleLevel = getModuleLevel(props.moduleCode)
  return m
}

/**
 * get all module codes from the module table
 * @return {Promise<string[]>}
 */
async function getCodes(): Promise<string[]> {
  const modules = await Repository.find()
  return modules.map((m) => m.moduleCode)
}

/**
 * fetches a list of condensed modules from NUSMods API
 * @return {Promise<ModuleCondensed[]>}
 */
async function fetch(): Promise<ModuleCondensed[]> {
  const res = await axios.get(nusmodsApi('moduleList'))
  const data: NMC[] = res.data
  return data.map((n) => build(n))
}

/**
 * pulls a list of condensed modules from NUSMods API
 * @return {Promise<ModuleCondensed[]>}
 */
async function pull(): Promise<ModuleCondensed[]> {
  const existingModules = new Set(
    (await ModuleCondensedRepository.find()).map((m) => m.moduleCode)
  )
  const freshModules = await fetch()
  const modulesToSave = freshModules.filter(
    (x) => !existingModules.has(x.moduleCode)
  )
  await ModuleCondensedRepository.save(modulesToSave)
  return modulesToSave
}

export const ModuleCondensedRepository = Repository.extend({
  build,
  getCodes,
  fetch,
  pull,
})
