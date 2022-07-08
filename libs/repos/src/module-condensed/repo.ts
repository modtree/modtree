import { DataSource } from 'typeorm'
import {
  ModuleCondensed,
  IModuleCondensedRepository,
  IModuleCondensed,
  InitModuleCondensedProps,
} from '@modtree/types'
import { getModuleLevel, flatten } from '@modtree/utils'
import { In } from 'typeorm'
import { BaseRepo } from '../utils'

export class ModuleCondensedRepository
  extends BaseRepo<ModuleCondensed>
  implements IModuleCondensedRepository
{
  constructor(db: DataSource) {
    super(ModuleCondensed, db)
  }

  deleteAll = () => this.createQueryBuilder().delete().execute()
  override findOneById = async (id: string) => this.findOneByOrFail({ id })

  /**
   * initialize a Module Condensed
   *
   * @param {InitModuleCondensedProps} props
   * @returns {Promise<ModuleCondensed>}
   */
  async initialize(props: InitModuleCondensedProps): Promise<ModuleCondensed> {
    return this.save(
      this.create({
        ...props,
        moduleLevel: getModuleLevel(props.moduleCode),
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
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]> {
    return this.find({ where: { moduleCode: In(moduleCodes) } })
  }
}
