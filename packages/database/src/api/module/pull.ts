import { getModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { db } from '../../config'
import { analyze } from '../analyze'

const moduleRepo = getModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
