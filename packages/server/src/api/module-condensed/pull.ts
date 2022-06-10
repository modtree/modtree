import { db, container } from '@modtree/typeorm-config'
import { ModuleCondensedRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

analyze(() => container(db, () => new ModuleCondensedRepository(db).pull()))
