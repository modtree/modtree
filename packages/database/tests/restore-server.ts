import { config } from '../src/config'
import { sql } from '../src/sql'

sql.restoreFromFile(config.database, config.restoreSource)
