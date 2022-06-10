import { db } from '@modtree/typeorm-config'
import { container } from '@modtree/utils'
import { getModuleRepository } from '../../repository/Module'
import { analyze } from '../analyze'

analyze(() =>
  container(db, () => getModuleRepository(db).findByFaculty('Computing'))
)
