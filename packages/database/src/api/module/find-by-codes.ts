import { db } from '@modtree/typeorm-config'
import { log , container } from '@modtree/utils'
import { getModuleRepository } from '../../repository/Module'
import { analyze } from '../analyze'

analyze(() =>
  container(db, async () => {
    const res = await getModuleRepository(db).findByCodes(['MA2001'])
    log.yellow(res[0].description.toString())
    return res
  })
)
