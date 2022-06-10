import { db } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { container } from '../../data-source'
import { analyze } from '../analyze'

analyze(() => container(db, () => getModuleCondensedRepository(db).fetch()))
