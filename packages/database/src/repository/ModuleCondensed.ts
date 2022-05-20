import axios from 'axios'
import { nusmodsApi, getModuleLevel } from '../utils/string'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { ModuleCondensed } from '../entity/ModuleCondensed'
import { db as DefaultSource } from '../config'
import { DataSource, Repository } from 'typeorm'

interface ModuleCondensedRepository extends Repository<ModuleCondensed> {
  pull(): Promise<ModuleCondensed[]>
  fetch(): Promise<ModuleCondensed[]>
  getCodes(): Promise<string[]>
  build(props: NMC): ModuleCondensed
}

/**
 * @param {DataSource} database
 * @return {ModuleCondensedRepository}
 */
export function ModuleCondensedRepository(
  database?: DataSource
): ModuleCondensedRepository {
  const db = database || DefaultSource
  const BaseRepo = db.getRepository(ModuleCondensed)

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
    return data.map((n) => build(n))
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
    build,
    getCodes,
    fetch,
    pull,
  })
}
