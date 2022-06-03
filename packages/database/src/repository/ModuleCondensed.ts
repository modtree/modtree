import axios from 'axios'
import { nusmodsApi, getModuleLevel, flatten } from '../utils'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { ModuleCondensed } from '../entity/ModuleCondensed'
import { DataSource } from 'typeorm'
import { getDataSource, useLoadRelations, useDeleteAll } from './base'
import type { ModuleCondensedRepository as Repository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @return {ModuleCondensedRepository}
 */
export function ModuleCondensedRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(ModuleCondensed)
  const loadRelations = useLoadRelations(BaseRepo)
  const deleteAll = useDeleteAll<ModuleCondensed>(BaseRepo)

  /**
   * get all module codes from the module table
   * @return {Promise<string[]>}
   */
  async function getCodes(): Promise<string[]> {
    const modules = await BaseRepo.find()
    return modules.map(flatten.module)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  async function fetch(): Promise<ModuleCondensed[]> {
    const res = await axios.get(nusmodsApi('moduleList'))
    const data: NMC[] = res.data
    return data.map((n) =>
      BaseRepo.create({ ...n, moduleLevel: getModuleLevel(n.moduleCode) })
    )
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  async function pull(): Promise<ModuleCondensed[]> {
    const existingModules = new Set(await getCodes())
    const freshModules = await fetch()
    const modulesToSave = freshModules.filter(
      (x) => !existingModules.has(x.moduleCode)
    )
    await BaseRepo.save(modulesToSave)
    return modulesToSave
  }

  return BaseRepo.extend({
    getCodes,
    fetch,
    pull,
    loadRelations,
    deleteAll,
  })
}
