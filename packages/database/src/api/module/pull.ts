import { db } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { analyze } from '../analyze'

const moduleRepo = getModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
