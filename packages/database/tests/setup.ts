import { config } from '../src/config'
import { wipe } from '../src/sql'

const setup = async () => {
  await wipe.database(config.database, config.restoreSource)
}

export default setup
