import { remove } from '../../../sql/remove'
import { config } from '../../../config'

remove.tables(config.database, ['degree_modules_module', 'degree'])
