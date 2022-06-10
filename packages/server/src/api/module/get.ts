import { db, container } from '@modtree/typeorm-config'
import { ModuleRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

analyze(() => container(db, () => new ModuleRepository(db).find()))
