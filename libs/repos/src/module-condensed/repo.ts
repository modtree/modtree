import { DataSource, In } from 'typeorm'
import { ModuleCondensed } from '@modtree/types'
import { getModuleLevel, flatten } from '@modtree/utils'
import { BaseRepo } from '../base'

export class ModuleCondensedRepository extends BaseRepo<ModuleCondensed> {
  constructor(db: DataSource) {
    super(ModuleCondensed, db)
  }

  deleteAll = () => this.createQueryBuilder().delete().execute()

  /**
   * initialize a Module Condensed
   *
   * @param {string} title
   * @param {string} moduleCode
   * @returns {Promise<ModuleCondensed>}
   */
  async initialize(
    title: string,
    moduleCode: string
  ): Promise<ModuleCondensed> {
    return this.save(
      this.create({
        title,
        moduleCode,
        moduleLevel: getModuleLevel(moduleCode),
      })
    )
  }

  /**
   * get all module codes from the module table
   *
   * @returns {Promise<string[]>}
   */
  async getCodes(): Promise<string[]> {
    return this.find().then((modules) => modules.map(flatten.module))
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<ModuleCondensed[]> {
    return this.find({ where: { moduleCode: In(moduleCodes) } })
  }

  /**
   * @param {string[]} moduleCode
   * @returns {Promise<T>}
   */
  findByCode(moduleCode: string): Promise<ModuleCondensed> {
    return this.findOne({ where: { moduleCode } })
  }
}
