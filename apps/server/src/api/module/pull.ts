import { db, container } from '@modtree/typeorm-config'
import { ModuleRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

const moduleRepo = new ModuleRepository(db)
analyze(() =>
  container(db, () => moduleRepo.deleteAll().then(() => moduleRepo.pull()))
)
