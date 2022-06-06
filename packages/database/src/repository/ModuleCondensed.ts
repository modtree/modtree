import axios from 'axios'
import { DataSource } from 'typeorm'
import type { InitProps } from '../../types/init-props'
import { nusmodsApi, getModuleLevel, Flatten } from '../utils'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { ModuleCondensed } from '../entity/ModuleCondensed'
import { getDataSource, useDeleteAll, useFindOneByKey } from './base'
import type { IModuleCondensedRepository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @returns {ModuleCondensedRepository}
 */
export function getModuleCondensedRepository(
  database?: DataSource
): IModuleCondensedRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(ModuleCondensed)
  const deleteAll = useDeleteAll<ModuleCondensed>(BaseRepo)
  const findOneById = useFindOneByKey(BaseRepo, 'id')

  /**
   * initialize a Module Condensed
   *
   * @param {InitProps['ModuleCondensed']} props
   * @returns {Promise<ModuleCondensed>}
   */
  async function initialize(
    props: InitProps['ModuleCondensed']
  ): Promise<ModuleCondensed> {
    return BaseRepo.create(props)
  }

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
    initialize,
    deleteAll,
    getCodes,
    pull,
    fetch,
    findOneById,
  })
}
