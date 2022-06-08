import { DataSource, Repository } from 'typeorm'
import { config } from '../src/config'
import { sql } from '../src/sql'
import {
  getUserRepository,
  getGraphRepository,
  getDegreeRepository,
  getModuleRepository,
  getModuleCondensedRepository,
} from '../src/repository'
import { User, Graph, Degree } from '../src/entity'
import { Repositories } from '../types/repository'

type SetupOptions = {
  initialize: boolean
}

const Repo: Repositories = {}
/**
 * pre-test setup
 *
 * @param {DataSource} db
 * @param {SetupOptions} opts
 * @returns {Promise<void>}
 */
export async function setup(
  db: DataSource,
  opts?: SetupOptions
): Promise<void> {
  /**
   * bundle initializing the database and initializing the repositories
   *
   * @returns {Promise<void>}
   */
  const initializeRepositories = (): Promise<void> =>
    db.initialize().then(() => {
      Repo.User = getUserRepository(db)
      Repo.Degree = getDegreeRepository(db)
      Repo.Module = getModuleRepository(db)
      Repo.ModuleCondensed = getModuleCondensedRepository(db)
      Repo.Graph = getGraphRepository(db)
    })
  return sql
    .restoreFromFile(db.options.database.toString(), config.restoreSource)
    .then(async () => {
      // by default, initialize a new connection
      if (!opts) {
        return initializeRepositories()
      }
      // else, read the config
      return opts.initialize ? initializeRepositories() : null
    })
}

/**
 * post-test teardown
 *
 * @param {DataSource} db
 */
export async function teardown(db: DataSource) {
  const drop = sql.dropDatabase(db.options.database.toString())
  if (db.isInitialized) {
    return db.destroy().then(() => drop)
  }
  return drop
}

type ImportCheckProps = { entities?: any[]; repositories?: Repository<any>[] }
/**
 * check imports before every test
 *
 * @param {ImportCheckProps} props
 */
export function importChecks(props: ImportCheckProps) {
  const entities = props.entities || []
  const repositories = props.repositories || []
  test('imports are all defined', () => {
    entities.forEach((e) => {
      expect(e).toBeDefined()
    })
    repositories.forEach((e) => {
      expect(e).toBeDefined()
    })
  })
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
  combinedModuleCodes: string[]
  postReqsCodes: string[]
  postReqs: string[]
  moduleCodes: string[]
  suggestedModulesCodes: string[]
}

export const t: Partial<TestProps> = {}
export { Repo }
