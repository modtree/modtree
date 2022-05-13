import { log } from '../cli'
import { ModuleCondensed as NMC } from '../../types/nusmods'
import { AppDataSource, container } from '../data-source'
import { ModuleCondensed } from '../entity'
import { nusmodsApi } from '../utils/string'
import axios from 'axios'

export namespace moduleCondensed {
  /**
   * get all condensed modules in the database
   * @return {Promise<ModuleCondensed[]>}
   */
  export async function get(): Promise<ModuleCondensed[]> {
    const modules = await container(async () => {
      const repo = AppDataSource.getRepository(ModuleCondensed)
      const modules = await repo.find().catch((err) => {
        log.warn('Warning: failed to get ModuleCondensed from database.')
        console.log(err)
      })
      return modules
    })
    if (!modules) {
      return []
    }
    return modules
  }

  /**
   * get module codes from the module table
   * @return {Promise<Set<string>>}
   */
  export async function getCodes(): Promise<Set<string>> {
    const modules = await get()
    const codes = modules.map(m => m.moduleCode)
    return new Set(codes)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  export async function fetch(): Promise<ModuleCondensed[]> {
    /* this line is required for JEST. Wihtout awaiting nextTick,
     * the next line will somehow trigger JEST's open handle catcher.
     */
    // await process.nextTick(() => true)
    const res = await axios.get(nusmodsApi('moduleList'))
    const data: NMC[] = res.data
    return data.map((n) => ModuleCondensed.new(n))
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   * @return {Promise<ModuleCondensed[]>}
   */
  export async function pull(): Promise<ModuleCondensed[]> {
    const existingModules = new Set((await get()).map(m => m.moduleCode))
    const freshModules = await fetch()
    const modulesToSave = freshModules.filter((x) => !existingModules.has(x.moduleCode))
    await AppDataSource.manager.save(modulesToSave)
    return modulesToSave
  }
}
