import { getModuleCondensedRepository } from '../../../repository'
import { db } from '../../../config'
import { analyze } from '../../analyze'
import { container } from '../../../data-source'

analyze(() => container(db, () => getModuleCondensedRepository(db).deleteAll()))
