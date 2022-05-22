import { restore } from '../../sql/restore'
import { config } from '../../config'
import { analyze } from '../analyze'
import { sql } from '../../sql'

analyze(() => sql.res(config.database, config.restoreSource))
