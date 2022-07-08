import { DataSource } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  IModuleRepository,
  IModuleCondensedRepository,
  IModuleFullRepository,
} from '@modtree/types'
import {
  UserRepository,
  DegreeRepository,
  ModuleRepository,
  ModuleCondensedRepository,
  ModuleFullRepository,
  GraphRepository,
} from '@modtree/repos'

export abstract class BaseApi {
  db: DataSource
  degreeRepo: IDegreeRepository
  userRepo: IUserRepository
  graphRepo: IGraphRepository
  moduleRepo: IModuleRepository
  moduleFullRepo: IModuleFullRepository
  moduleCondensedRepo: IModuleCondensedRepository

  constructor(db: DataSource) {
    this.db = db
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
    this.graphRepo = new GraphRepository(db)
    this.moduleRepo = new ModuleRepository(db)
    this.moduleFullRepo = new ModuleFullRepository(db)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
  }
}
