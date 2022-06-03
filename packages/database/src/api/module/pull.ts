import { ModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { db } from '../../config'
import { analyze } from '../analyze'

analyze(() => container(db, () => ModuleRepository(db).pull()))
