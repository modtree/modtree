import { db } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { analyze } from '../analyze'

analyze(() => container(db, () => getModuleRepository(db).getCodes()))
