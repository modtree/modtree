import { DataSource, Repository } from 'typeorm'
import { ModuleFull } from '@modtree/types'
import { IModuleFullRepository } from '@modtree/types'

export class ModuleFullRepository
  extends Repository<ModuleFull>
  implements IModuleFullRepository
{
  constructor(db: DataSource) {
    super(ModuleFull, db.manager)
  }

  findOneByCode = async (moduleCode: string) =>
    this.findOneByOrFail({ moduleCode })
}
