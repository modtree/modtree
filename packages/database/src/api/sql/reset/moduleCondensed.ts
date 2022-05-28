import { ModuleCondensedRepository } from '../../../repository'
import { db } from '../../../config'
import { analyze } from '../../analyze'
import { container } from '../../..'

analyze(() => container(db, () => ModuleCondensedRepository(db).deleteAll()))
