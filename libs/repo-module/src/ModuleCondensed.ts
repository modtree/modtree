import axios from 'axios'
import { DataSource, Repository } from 'typeorm'
import { ModuleCondensed } from '@modtree/entity'
import {
  InitProps,
  NUSMods,
  IModuleCondensedRepository,
  FindOneById,
  IModuleCondensed,
} from '@modtree/types'
import { nusmodsApi, getModuleLevel, flatten } from '@modtree/utils'
import { useDeleteAll, useFindOneByKey } from '@modtree/repo-base'

export class ModuleCondensedRepository
  extends Repository<ModuleCondensed>
  implements IModuleCondensedRepository
{
  constructor(db: DataSource) {
    super(ModuleCondensed, db.manager)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindOneById<IModuleCondensed> = useFindOneByKey(
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
    return this.create(props)
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
