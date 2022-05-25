import { config } from '../../config'
import { sql } from '../../sql'

sql.restoreFromFile(config.database, process.env.RESTORE_SOURCE)
