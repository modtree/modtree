import { ModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { container } from '../..'
import { db } from '../../config'
import { analyze } from '../analyze'

analyze(() => container(db, () => ModuleCondensedRepository(db).pull()))
