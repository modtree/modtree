import { db, container } from '@modtree/typeorm-config'
import { log } from '@modtree/utils'
import { ModuleRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

analyze(() =>
  container(db, async () => {
    const res = await new ModuleRepository(db).findByCodes(['MA2001'])
    log.yellow(res[0].description.toString())
    return res
  })
)
