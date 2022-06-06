import axios from 'axios'
import { DataSource } from 'typeorm'
import { nusmodsApi, getModuleLevel, Flatten } from '../utils'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { ModuleCondensed } from '../entity/ModuleCondensed'
import { getDataSource, useDeleteAll } from './base'
import type { ModuleCondensedRepository as Repository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @returns {ModuleCondensedRepository}
 */
export function ModuleCondensedRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(ModuleCondensed)
  const deleteAll = useDeleteAll<ModuleCondensed>(BaseRepo)

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async function getCodes(): Promise<string[]> {
    const modules = await BaseRepo.find()
    return modules.map(Flatten.module)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   *
   * @returns {Promise<ModuleCondensed[]>}
   */
  async function fetch(): Promise<ModuleCondensed[]> {
    const res = await axios.get(nusmodsApi('moduleList'))
    const { data } = res
    return data.map((n: NMC) =>
      BaseRepo.create({ ...n, moduleLevel: getModuleLevel(n.moduleCode) })
    )
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   *
   * @returns {Promise<ModuleCondensed[]>}
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
    deleteAll,
  })
}
