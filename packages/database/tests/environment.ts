import { config } from '../src/config'
import { remove, restore, wipe } from '../src/sql'

/**
 * pre-test setup
 */
export async function setup(database: string) {
  await wipe.database(database)
  await restore.file(database, config.restoreSource)
}

/**
 * post-test teardown
 */
export async function teardown(database: string) {
  await remove.database(database)
}

export function importChecks(props: {entities?: any[], repositories?: any[] }) {
  const entities = props.entities || []
  const repositories = props.repositories || []
  test('imports are all defined', () => {
    entities.forEach(e => {
      expect(e).toBeDefined()
    })
    repositories.forEach(e => {
      expect(e).toBeDefined()
    })
  })
}
