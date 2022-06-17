import { DataSource } from 'typeorm'
import {
  IModuleRepository,
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
} from '@modtree/types'
import { ModuleRepository } from '@modtree/repo-module'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '@modtree/repo-graph'

export class Api {
  private db: DataSource
  private moduleRepo: IModuleRepository
  private degreeRepo: IDegreeRepository
  private userRepo: IUserRepository
  private graphRepo: IGraphRepository

  constructor(db: DataSource) {
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.degreeRepo = new DegreeRepository(this.db)
    this.userRepo = new UserRepository(this.db)
    this.graphRepo = new GraphRepository(this.db)
  }
}
