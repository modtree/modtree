import { config } from '@modtree/typeorm-config'
import { sql } from '@modtree/sql'

sql.restorePrompted(config.database)
