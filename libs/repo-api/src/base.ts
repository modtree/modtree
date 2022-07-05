import { DataSource } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  IModuleRepository,
  IModuleCondensedRepository,
  EntityName,
  IModuleFullRepository,
} from '@modtree/types'
import {
  UserRepository,
  DegreeRepository,
  ModuleRepository,
  ModuleCondensedRepository,
  ModuleFullRepository,
  GraphRepository,
  getRelationNames,
} from '@modtree/repos'
import { MiniApi } from './types'

type Relations = Record<string, boolean>

export abstract class BaseApi {
  db: DataSource
  degreeRepo: IDegreeRepository
  userRepo: IUserRepository
  graphRepo: IGraphRepository
  moduleRepo: IModuleRepository
  moduleFullRepo: IModuleFullRepository
  moduleCondensedRepo: IModuleCondensedRepository
  relations: Record<EntityName, Relations>
  miniApi: MiniApi

  constructor(db: DataSource) {
    this.db = db
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
    this.graphRepo = new GraphRepository(db)
    this.moduleRepo = new ModuleRepository(db)
    this.moduleFullRepo = new ModuleFullRepository(db)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
    this.miniApi = {
      degreeRepo: this.degreeRepo,
      userRepo: this.userRepo,
      graphRepo: this.graphRepo,
      moduleRepo: this.moduleRepo,
      moduleFullRepo: this.moduleFullRepo,
      moduleCondensedRepo: this.moduleCondensedRepo,
    }
    this.relations = {
      user: getRelationNames(this.userRepo),
      degree: getRelationNames(this.degreeRepo),
      graph: getRelationNames(this.graphRepo),
      module: {},
      moduleCondensed: {},
      moduleFull: {},
    }
  }
}
