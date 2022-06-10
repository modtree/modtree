import { db } from '@modtree/typeorm-config'
import { container } from '@modtree/utils'
import { getModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { analyze } from '../analyze'

analyze(() => container(db, () => getModuleCondensedRepository(db).pull()))
