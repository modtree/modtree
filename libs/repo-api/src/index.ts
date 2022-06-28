import { DataSource } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  IModuleRepository,
  IModuleCondensedRepository,
  EntityName,
} from '@modtree/types'
import { emptyInit } from '@modtree/utils'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '@modtree/repo-graph'
import { User } from '@modtree/entity'
import {
  ModuleCondensedRepository,
  ModuleRepository,
} from '@modtree/repo-module'
import { getRelationNames } from '@modtree/repo-base'

type Relations = Record<string, boolean>

export class Api {
  db: DataSource
  degreeRepo: IDegreeRepository
  userRepo: IUserRepository
  graphRepo: IGraphRepository
  moduleRepo: IModuleRepository
  moduleCondensedRepo: IModuleCondensedRepository
  relations: Record<EntityName, Relations>

  constructor(db: DataSource) {
    this.db = db
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
    this.graphRepo = new GraphRepository(db)
    this.moduleRepo = new ModuleRepository(db)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
    this.relations = {
      user: getRelationNames(this.userRepo),
      degree: getRelationNames(this.degreeRepo),
      graph: getRelationNames(this.graphRepo),
      module: getRelationNames(this.moduleRepo),
      moduleCondensed: getRelationNames(this.moduleCondensedRepo),
    }
  }

  /**
   * Creates a functional User entity, with a default degree and a
   * default graph.
   *
   * It only takes auth0 id and email, since those are the only two
   * asked for at user sign-up
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<User>}
   */
  async initializeUser(authZeroId: string, email: string): Promise<User> {
    return Promise.all([
      /** initialize a user and an empty degree */
      this.userRepo.initialize({ ...emptyInit.User, authZeroId, email }),
      this.degreeRepo.initialize({ ...emptyInit.Degree, title: 'Untitled' }),
    ])
      .then(([user, degree]) => {
        return Promise.all([
          user,
          degree,
          /** initialize an empty graph */
          this.graphRepo.initialize({
            ...emptyInit.Graph,
            userId: user.id,
            degreeId: degree.id,
          }),
        ])
      })
      .then(([user, degree, graph]) => {
        /** add the degree to the user */
        user.savedDegrees.push(degree)
        /** add the graph to the user */
        user.savedGraphs.push(graph)
        /** save and return the user */
        return this.userRepo.save(user)
      })
  }

  /**
   * Handles a user logging in.
   *
   * If the auth0 id already exists in database, then return that
   * user's data
   *
   * If not, then initialize a full user (empty degree, empty graph),
   * and return that newly created user instead.
   *
   * @param {string} authZeroId
   * @param {string} email
   * @returns {Promise<User>}
   */
  async userLogin(authZeroId: string, email: string): Promise<User> {
    return this.userRepo.findOneByAuthZeroId(authZeroId).catch(() => {
      return this.initializeUser(authZeroId, email)
    })
  }

  /**
   * sets up database state for frontend testing
   * do run the postgres.sh script at root to restore the database to a
   * modules-only state first.
   */
  async frontendSetup() {
    const user1 = this.initializeUser(
      'auth0|012345678901234567890001',
      'chandler@bing.com'
    )
    const user2 = this.initializeUser(
      'auth0|012345678901234567890002',
      'joey@tribbiani.com'
    )
    const user3 = this.initializeUser(
      'auth0|012345678901234567890003',
      'ross@geller.com'
    )
    return Promise.all([user1, user2, user3])
  }
}
