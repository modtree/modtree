import { db, container } from '@modtree/typeorm-config'
import { getModuleRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

analyze(() =>
  container(db, () => getModuleRepository(db).findByFaculty('Computing'))
)
