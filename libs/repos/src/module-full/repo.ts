import { DataSource, In } from 'typeorm'
import { ModuleFull } from '@modtree/types'
import { BaseRepo } from '../base'

export class ModuleFullRepository extends BaseRepo<ModuleFull> {
  constructor(db: DataSource) {
    super(ModuleFull, db)
  }

  /**
   * @param {string[]} moduleCode
   * @returns {Promise<ModuleFull>}
   */
  findByCode = async (moduleCode: string): Promise<ModuleFull> =>
    this.findOne({ where: { moduleCode } })

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<ModuleFull[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<ModuleFull[]> {
    return this.find({ where: { moduleCode: In(moduleCodes) } })
  }
}
