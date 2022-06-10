import { config } from '@modtree/typeorm-config'
import { sql } from '../../sql'

sql.dump(config.database)
