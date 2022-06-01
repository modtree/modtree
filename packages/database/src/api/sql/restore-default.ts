import { config } from '../../config'
import { sql } from '../../sql'

sql.restoreFromFile(config.database, 'postgres-modules-only.sql')
