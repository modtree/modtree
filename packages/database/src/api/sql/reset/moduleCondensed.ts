import { db } from '@modtree/typeorm-config'
import { container } from '@modtree/utils'
import { getModuleCondensedRepository } from '../../../repository'
import { analyze } from '../../analyze'

analyze(() => container(db, () => getModuleCondensedRepository(db).deleteAll()))
