import { DataSource } from 'typeorm'
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
  degreeRepo: DegreeRepository
  userRepo: UserRepository
  graphRepo: GraphRepository
  moduleRepo: ModuleRepository
  moduleFullRepo: ModuleFullRepository
  moduleCondensedRepo: ModuleCondensedRepository

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
