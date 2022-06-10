import { db, container } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../../repository'
import { analyze } from '../../analyze'

analyze(() => container(db, () => getModuleRepository(db).deleteAll()))
