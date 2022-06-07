import { getModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { container } from '../../data-source'
import { db } from '../../config'
import { analyze } from '../analyze'

analyze(() => container(db, () => getModuleCondensedRepository(db).getCodes()))
