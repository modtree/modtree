import { DataSource } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  IModuleRepository,
  IModuleCondensedRepository,
  EntityName,
  IModuleFullRepository,
  FlowNode,
} from '@modtree/types'
import { empty, emptyInit } from '@modtree/utils'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '@modtree/repo-graph'
import { ModuleFullRepository } from '@modtree/repo-module-full'
import { User, Degree, Graph } from '@modtree/entity'
import {
  ModuleCondensedRepository,
  ModuleRepository,
} from '@modtree/repo-module'
import { getRelationNames } from '@modtree/repo-base'
import { auto } from './init'

type Relations = Record<string, boolean>

export class Api {
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
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
    this.graphRepo = new GraphRepository(db)
    this.moduleRepo = new ModuleRepository(db)
    this.moduleFullRepo = new ModuleFullRepository(db)
    this.moduleCondensedRepo = new ModuleCondensedRepository(db)
    this.relations = {
      user: getRelationNames(this.userRepo),
      degree: getRelationNames(this.degreeRepo),
      graph: getRelationNames(this.graphRepo),
      module: {},
      moduleCondensed: {},
      moduleFull: {},
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
    const user = this.userRepo.initialize({ authZeroId, email })
    const degree = this.degreeRepo.initialize({
      ...emptyInit.Degree,
      title: 'Computer Science',
      moduleCodes: [
        'CS1231S',
        'CS2030S',
        'CS2040S',
        'CS2100',
        'CS2101',
        'CS2103T',
        'CS2106',
        'CS2109S',
        'CS3230',
        'CS2309',
      ],
    })
    const graph = Promise.all([user, degree]).then(([user, degree]) =>
      this.graphRepo.initialize({
        ...emptyInit.Graph,
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: ['CS1010S'],
        pullAll: true,
      })
    )
    const updatedUser = Promise.all([user, degree, graph]).then(
      ([user, degree, graph]) => {
        /** add the degree to the user */
        user.savedDegrees.push(degree)
        /** add the graph to the user */
        user.savedGraphs.push(graph)
        /** save and return the user */
        return this.userRepo.save(user)
      }
    )
    return updatedUser
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
    const degree1 = user1.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = 'Data Analytics'
      degree.modules = []
      return this.degreeRepo.insertModules(degree, [
        'DSA1101',
        'CS2040',
        'DSA2101',
        'DSA2102',
        'MA2001',
        'MA2002',
        'MA2311',
        'ST2131',
        'ST2132',
        'CS3244',
        'DSA3101',
        'DSA3102',
        'ST3131',
      ])
    })
    const degree2 = user2.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = 'Improvisation'
      return this.degreeRepo.save(degree)
    })
    const degree3 = user3.then((user) => {
      const degree = user.savedDegrees[0]
      degree.title = 'Paleontology'
      return this.degreeRepo.save(degree)
    })
    return Promise.all([user1, user2, user3, degree1, degree2, degree3])
  }

  async autoSetup() {
    // setup user and degree
    let u1: User = await this.userRepo.initialize(auto.user1)
    let u2: User = await this.userRepo.initialize(auto.user2)
    let d1: Degree = await this.degreeRepo.initialize(auto.degree1)
    let d2: Degree = await this.degreeRepo.initialize(auto.degree2)

    // setup graphs
    const g1: Graph = await this.graphRepo.initialize({
      ...auto.graph1,
      userId: u1.id,
      degreeId: d1.id,
    })
    const g2: Graph = await this.graphRepo.initialize({
      ...auto.graph2,
      userId: u2.id,
      degreeId: d2.id,
    })

    // insert degrees and graphs
    // user1: {
    //    savedDegrees: [d1],
    //    savedGraphs: [g1],
    // }
    u1 = await this.userRepo.insertDegrees(u1, [d1.id])
    u1 = await this.userRepo.insertGraphs(u1, [g1.id])
    u2 = await this.userRepo.insertDegrees(u2, [d2.id])
    u2 = await this.userRepo.insertGraphs(u2, [g2.id])

    // set main degrees and graphs
    // user1: {
    //    mainDegree: d1,
    //    savedDegrees: [d1],
    //    mainGraph: g1,
    //    savedGraphs: [g1],
    // }
    u1 = await this.userRepo.setMainDegree(u1, d1.id)
    u1 = await this.userRepo.setMainGraph(u1, g1.id)
    u2 = await this.userRepo.setMainDegree(u2, d2.id)
    u2 = await this.userRepo.setMainGraph(u2, g2.id)

    // fix fake nodes data
    // nodes[0] is CS1010S
    // nodes[1] is MA2001
    const nodes = auto.nodes
    nodes[0].data = await this.moduleRepo.findOneByOrFail({
      moduleCode: 'CS1010S',
    })
    nodes[1].data = await this.moduleRepo.findOneByOrFail({
      moduleCode: 'MA2001',
    })

    return {
      u1,
      u2,
      d1,
      d2,
      g1,
      g2,
    }
  }
}
