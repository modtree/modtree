import { sql } from '../../sql'
import { config } from '../../config'

sql.dump(config.database)
