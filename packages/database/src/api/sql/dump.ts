import { config } from '@modtree/typeorm-config'
import { sql } from '@modtree/sql'

sql.dump(config.database)
