import { DataSource } from 'typeorm'
import { ModuleFull } from '@modtree/types'
import { IModuleFullRepository } from '@modtree/types'
import { BaseRepo } from '../base'

export class ModuleFullRepository
  extends BaseRepo<ModuleFull>
  implements IModuleFullRepository
{
  constructor(db: DataSource) {
    super(ModuleFull, db)
  }

  findByCode = async (moduleCode: string) =>
    this.findOne({ where: { moduleCode } })
}
