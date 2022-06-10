import { config } from '@modtree/typeorm-config'
import { sql } from '../../sql'

sql.restoreFromFile(config.database, 'postgres-modules-only.sql')
