import { DataSource } from 'typeorm'
import { ModuleFull } from '@modtree/types'
import { IModuleFullRepository } from '@modtree/types'
import { BaseRepo } from '../base'

export class ModuleFullRepository implements IModuleFullRepository {
  private repo: BaseRepo<ModuleFull>
  constructor(db: DataSource) {
    this.repo = new BaseRepo(ModuleFull, db)
  }

  findOneByCode = async (moduleCode: string) =>
    this.repo.findOneByOrFail({ moduleCode })
}
