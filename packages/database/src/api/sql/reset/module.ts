import { remove } from '../../../sql/remove'

remove.tables([
  'user_modules_completed_module',
  'user_modules_doing_module',
  'degree_modules_required_module',
  'module',
])
