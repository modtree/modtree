import { config } from '@modtree/typeorm-config'
import { sql } from '../../sql'

sql.restorePrompted(config.database)
