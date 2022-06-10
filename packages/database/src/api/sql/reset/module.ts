import { db } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../../repository'
import { analyze } from '../../analyze'
import { container } from '../../../data-source'

analyze(() => container(db, () => getModuleRepository(db).deleteAll()))
