import { db, container } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../repository/Module'
import { analyze } from '../analyze'

analyze(() => container(db, () => getModuleRepository(db).getCodes()))
