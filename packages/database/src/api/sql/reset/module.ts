import { config } from '../../../config'
import { sql } from '../../../sql'

sql.dropTables(config.database, [
  'dag_modules_placed_module',
  'dag_modules_hidden_module',
  'user_modules_doing_module',
  'user_modules_done_module',
  'degree_modules_module',
  'module',
])
