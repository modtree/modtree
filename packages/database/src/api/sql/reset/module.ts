import { db } from '@modtree/typeorm-config'
import { container } from '@modtree/utils'
import { getModuleRepository } from '../../../repository'
import { analyze } from '../../analyze'

analyze(() => container(db, () => getModuleRepository(db).deleteAll()))
