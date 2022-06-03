import { ModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { db } from '../../config'
import { analyze } from '../analyze'

const moduleRepo = ModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
