import { remove } from '../../../sql/remove'
import { config } from '../../../config'

remove.tables(config.database, [
  'dag_modules_placed_module',
  'dag_modules_hidden_module',
  'dag_modules_hidden_module',
  'user_modules_doing_module',
  'user_modules_done_module',
  'degree_modules_module',
  'module',
])
