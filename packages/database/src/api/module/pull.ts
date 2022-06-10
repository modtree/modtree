import { db } from '@modtree/typeorm-config'
import { container } from '@modtree/utils'
import { getModuleRepository } from '../../repository/Module'
import { analyze } from '../analyze'

const moduleRepo = getModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
