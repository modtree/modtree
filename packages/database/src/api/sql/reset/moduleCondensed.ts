import { remove } from '../../../sql/remove'
import { config } from '../../../config'

remove.tables(config.database, ['moduleCondensed'])
