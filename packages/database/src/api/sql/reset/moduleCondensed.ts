import { sql } from '../../../sql'
import { config } from '../../../config'

sql.dropTables(config.database, ['moduleCondensed'])
