import { DataSource, Repository } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  IModuleRepository,
  IModuleCondensedRepository,
  EntityName,
  IModuleFullRepository,
  Graph,
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

  constructor(db: DataSource) {
    this.db = db
    this.moduleFullRepo = new ModuleFullRepository(db)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
    this.moduleRepo = new ModuleRepository(db)
    this.degreeRepo = new DegreeRepository(db, { module: this.moduleRepo })
    this.userRepo = new UserRepository(db, {
      module: this.moduleRepo,
      degree: this.degreeRepo,
      graph: new Repository(Graph, db.manager),
    })
    this.graphRepo = new GraphRepository(db, {
      module: this.moduleRepo,
      degree: this.degreeRepo,
      user: this.userRepo,
    })
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
