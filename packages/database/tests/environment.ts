import { Repository } from 'typeorm'
import { config } from '../src/config'
import { sql } from '../src/sql'

/**
 * pre-test setup
 * @param {string} database
 */
export async function setup(database: string) {
  await sql.restoreFromFile(database, config.restoreSource)
}

/**
 * post-test teardown
 * @param {string} database
 */
export async function teardown(database: string) {
  await sql.dropDatabase(database)
}

type ImportCheckProps = { entities?: any[]; repositories?: Repository<any>[] }
/**
 * check imports before every test
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
