import { remove } from '../../../sql/remove'
import { config } from '../../../config'

remove.tables(config.database, [
  'user_modules_done_module',
  'user_modules_doing_module',
  'degree_modules_module',
  'module',
])
