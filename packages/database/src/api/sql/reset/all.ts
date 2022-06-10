import { config } from '@modtree/typeorm-config'
import { sql } from '@modtree/sql'
import { analyze } from '../../analyze'

analyze(() => sql.dropDatabase(config.database))
