import { config } from '@modtree/typeorm-config'
import { sql } from '@modtree/sql'

sql.dropTables(config.database, ['degree_modules_module', 'degree'])
