import { ModuleRepository } from '../../repository/Module'
import { container } from '../..'
import { db } from '../../config'
import { analyze } from '../analyze'

analyze(() => container(db, () => ModuleRepository(db).findByCodes(['MA2001'])))
