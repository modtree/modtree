import { config } from '@modtree/typeorm-config'
import { sql } from '../../../sql'

sql.dropTables(config.database, ['degree_modules_module', 'degree'])
