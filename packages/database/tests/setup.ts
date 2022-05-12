import { config } from '../src/config'
import { restore, wipe } from '../src/sql'

export async function setup() {
  await wipe.database(config.database)
  await restore.file(config.restoreSource)
}
