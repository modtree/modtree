import { DataSource, Repository } from 'typeorm'
import { config } from '../src/config'
import { sql } from '../src/sql'

type SetupOptions = {
  initialize: boolean
}

/**
 * pre-test setup
 *
 * @param {DataSource} db
 * @param {SetupOptions} opts
 */
export async function setup(db: DataSource, opts?: SetupOptions) {
  return sql
    .restoreFromFile(db.options.database.toString(), config.restoreSource)
    .then(() => {
      // by default, initialize a new connection
      if (!opts) return db.initialize()
      // else, read the config
      return opts.initialize ? db.initialize() : null
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
