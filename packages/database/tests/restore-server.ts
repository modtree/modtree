import { config } from '@modtree/typeorm-config'
import { sql } from '../src/sql'

sql.restoreFromFile(config.database, config.restoreSource)
