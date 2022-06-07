import { getModuleRepository } from '../../repository/Module'
import { container } from '../../data-source'
import { db } from '../../config'
import { analyze } from '../analyze'

analyze(() =>
  container(db, async () => {
    const res = await getModuleRepository(db).findByCodes(['MA2001'])
    console.log(res[0].description.toString())
    return res
  })
)
