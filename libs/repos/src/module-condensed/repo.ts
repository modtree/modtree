import { DataSource, In } from 'typeorm'
import {
  ModuleCondensed,
  IModuleCondensedRepository,
  InitModuleCondensedProps,
} from '@modtree/types'
import { getModuleLevel, flatten } from '@modtree/utils'
import { BaseRepo } from '../base'

export class ModuleCondensedRepository implements IModuleCondensedRepository {
  private repo: BaseRepo<ModuleCondensed>
  constructor(db: DataSource) {
    this.repo = new BaseRepo(ModuleCondensed, db)
  }

  deleteAll = () => this.repo.createQueryBuilder().delete().execute()
  findOneById = async (id: string) => this.repo.findOneByOrFail({ id })

  /**
   * initialize a Module Condensed
   *
   * @param {InitModuleCondensedProps} props
   * @returns {Promise<ModuleCondensed>}
   */
  async initialize(props: InitModuleCondensedProps): Promise<ModuleCondensed> {
    return this.repo.save(
      this.repo.create({
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
    return this.repo.find().then((modules) => modules.map(flatten.module))
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<ModuleCondensed[]> {
    return this.repo.find({ where: { moduleCode: In(moduleCodes) } })
  }

  /**
   * @param {string[]} moduleCode
   * @returns {Promise<T>}
   */
  findByCode(moduleCode: string): Promise<ModuleCondensed> {
    return this.repo.findOneByOrFail({ moduleCode })
  }
}
