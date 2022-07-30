import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/types'
import { sql } from '@modtree/sql'
import { DataSource } from 'typeorm'
import {
  DegreeRepository,
  ModuleRepository,
  ModuleCondensedRepository,
  GraphRepository,
  UserRepository,
  ModuleFullRepository,
  Api,
} from '@modtree/repos'

/**
 * imports custom matcher types
 */
import './matcher-types'
import path from 'path'

type SetupOptions = {
  initialize?: boolean
  restore?: boolean
}

/**
 * initialize with default db
 */
let Repo: {
  Module: ModuleRepository
  ModuleFull: ModuleFullRepository
  ModuleCondensed: ModuleCondensedRepository
  User: UserRepository
  Degree: DegreeRepository
  Graph: GraphRepository
}
let api: Api

/**
 * pre-test setup
 *
 * @param {DataSource} db
 * @param {SetupOptions} _opts
 * @returns {Promise<void>}
 */
export async function setup(
  db: DataSource,
  _opts?: SetupOptions
): Promise<void> {
  const opts = { initialize: true, restore: true }
  Object.assign(opts, _opts)
  const startConnection = () =>
    db.initialize().then((db) => {
      /**
       * overwrite default db with the setup function's db parameter
       */
      api = new Api(db)
      Repo = {
        ModuleFull: new ModuleFullRepository(db),
        User: new UserRepository(db),
        Degree: new DegreeRepository(db),
        Graph: new GraphRepository(db),
        Module: new ModuleRepository(db),
        ModuleCondensed: new ModuleCondensedRepository(db),
      }
    })
  if (db.options.database === undefined) return
  if (opts.restore) {
    await sql.restoreFromFile(db.options.database.toString(), 'latest.sql')
  }
  // by default, initialize a new connection
  if (!opts) {
    return startConnection()
  }
  // else, read the config
  if (opts.initialize) {
    return startConnection()
  }
  return
}

/**
 * post-test teardown
 *
 * @param {DataSource} db
 */
export async function teardown(db: DataSource, dropDatabase: boolean = false) {
  if (db.options.database === undefined) return
  if (db.isInitialized) {
    await db.destroy()
  }
  if (dropDatabase) {
    await sql.dropDatabase(db.options.database.toString())
  }
}

type TestProps = {
  user: User
  user1: User
  user2: User
  degree: Degree
  degree1: Degree
  degree2: Degree
  graph: Graph
  graph1: Graph
  graph2: Graph
  userId: string
  userId1: string
  userId2: string
  degreeId: string
  degreeId1: string
  degreeId2: string
  graphId: string
  graphId1: string
  graphId2: string
  modules: Module[]
  modulesCondensed: ModuleCondensed[]
  combinedModuleCodes: string[]
  postReqsCodes: string[]
  postReqs: string[]
  moduleCodes: string[]
  suggestedModulesCodes: string[]
  count: number
  arrayOfArrays: string[][]
}

export const t: Partial<TestProps> = {}
export { Repo, api }
