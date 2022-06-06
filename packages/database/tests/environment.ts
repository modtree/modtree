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
import {
  IModuleRepository,
  IUserRepository,
  IGraphRepository,
  IDegreeRepository,
  IModuleCondensedRepository,
} from '../types/repository'

type SetupOptions = {
  initialize: boolean
}

const repo: Repositories = {}
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
      repo.User = getUserRepository(db)
      repo.Degree = getDegreeRepository(db)
      repo.Module = getModuleRepository(db)
      repo.ModuleCondensed = getModuleCondensedRepository(db)
      repo.Graph = getGraphRepository(db)
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

export type Repositories = Partial<{
  Module: IModuleRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}>

export const t: any = {}
export { repo }
