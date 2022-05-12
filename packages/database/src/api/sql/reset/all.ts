import { config } from '../../../config'
import { wipe } from '../../../sql/wipe'
import { analyze } from '../../analyze'

analyze(() => wipe.database(config.database))
