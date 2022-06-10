import { db, container } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '../../../repository'
import { analyze } from '../../analyze'

analyze(() => container(db, () => getModuleCondensedRepository(db).deleteAll()))
