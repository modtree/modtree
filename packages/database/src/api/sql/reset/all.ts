import { config } from '../../../config'
import { sql } from '../../../sql'
import { analyze } from '../../analyze'

analyze(() => sql.dropDatabase(config.database))
