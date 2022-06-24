import { DataSource, Repository } from 'typeorm'
import { ModuleCondensed } from '@modtree/entity'
import {
  InitProps,
  IModuleCondensedRepository,
  FindByKey,
  IModuleCondensed,
} from '@modtree/types'
import { getModuleLevel, flatten } from '@modtree/utils'
import { useDeleteAll, useFindOneByKey } from '@modtree/repo-base'
import { In } from 'typeorm'

export class ModuleCondensedRepository
  extends Repository<ModuleCondensed>
  implements IModuleCondensedRepository
{
  constructor(db: DataSource) {
    super(ModuleCondensed, db.manager)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindByKey<IModuleCondensed> = useFindOneByKey(
    this,
    'id'
  )

  /**
   * initialize a Module Condensed
   *
   * @param {InitProps['ModuleCondensed']} props
   * @returns {Promise<ModuleCondensed>}
   */
  async initialize(
    props: InitProps['ModuleCondensed']
  ): Promise<ModuleCondensed> {
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
    const modules = await this.find()
    return modules.map(flatten.module)
  }

  /**
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]> {
    return this.find({ where: { moduleCode: In(moduleCodes) } })
  }
}
