import { db } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '../../../repository'
import { analyze } from '../../analyze'
import { container } from '../../../data-source'

analyze(() => container(db, () => getModuleCondensedRepository(db).deleteAll()))
