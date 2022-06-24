import axios from 'axios'
import { DataSource, Repository } from 'typeorm'
import { ModuleCondensed } from '@modtree/entity'
import { NUSMods } from '@modtree/types'
import { nusmodsApi, getModuleLevel, flatten } from '@modtree/utils'

export class ModuleCondensedRepository extends Repository<ModuleCondensed> {
  constructor(db: DataSource) {
    super(ModuleCondensed, db.manager)
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async getCodes(): Promise<string[]> {
    const modules = await this.find()
    return modules.map(flatten.module)
  }

  /**
   * fetches a list of condensed modules from NUSMods API
   *
   * @returns {Promise<ModuleCondensed[]>}
   */
  async fetch(): Promise<ModuleCondensed[]> {
    const res = await axios.get(nusmodsApi('moduleList'))
    const { data } = res
    return data.map((n: NUSMods.ModuleCondensed) =>
      this.create({ ...n, moduleLevel: getModuleLevel(n.moduleCode) })
    )
  }

  /**
   * pulls a list of condensed modules from NUSMods API
   *
   * @returns {Promise<ModuleCondensed[]>}
   */
  async pull(): Promise<ModuleCondensed[]> {
    const existingModules = new Set(await this.getCodes())
    const freshModules = await this.fetch()
    const modulesToSave = freshModules.filter(
      (x) => !existingModules.has(x.moduleCode)
    )
    return this.save(modulesToSave)
  }
}
