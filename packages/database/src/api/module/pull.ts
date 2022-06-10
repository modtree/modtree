import { db, container } from '@modtree/typeorm-config'
import { getModuleRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

const moduleRepo = getModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
