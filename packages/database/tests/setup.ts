import { config } from '../src/config'
import { restore, wipe } from '../src/sql'

/**
 * pre-test setup
 */
export async function setup() {
  await wipe.database(config.database)
  await restore.file(config.restoreSource)
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
