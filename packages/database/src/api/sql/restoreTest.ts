import { restore } from '../../sql/restore'
import { config } from '../../config'
import { analyze } from '../analyze'

analyze(() => restore.file(config.database, config.restoreSource))
