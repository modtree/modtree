import { DataSource, Repository } from 'typeorm'
import { ModuleFull } from '@modtree/entity'
import { FindByKey, IModuleFullRepository } from '@modtree/types'
import { useFindOneByKey } from '@modtree/repo-base'

export class ModuleFullRepository
  extends Repository<ModuleFull>
  implements IModuleFullRepository
{
  constructor(db: DataSource) {
    super(ModuleFull, db.manager)
  }

  findOneByCode: FindByKey<ModuleFull> = useFindOneByKey(this, 'moduleCode')
}
