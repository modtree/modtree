import axios from 'axios'
import { nusmodsApi, getModuleLevel } from '../utils/string'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { ModuleCondensed } from '../entity/ModuleCondensed'
import { DataSource } from 'typeorm'
import { getDataSource, useBuild, useLoadRelations, useDeleteAll } from './base'
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
    return modules.map((m) => m.moduleCode)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  async function fetch(): Promise<ModuleCondensed[]> {
    const res = await axios.get(nusmodsApi('moduleList'))
    const data: NMC[] = res.data
    return data.map((n) =>
      useBuild(db, ModuleCondensed, {
        ...n,
        moduleLevel: getModuleLevel(n.moduleCode),
      })
    )
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  async function pull(): Promise<ModuleCondensed[]> {
    const existingModules = new Set(
      (await BaseRepo.find()).map((m) => m.moduleCode)
    )
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
