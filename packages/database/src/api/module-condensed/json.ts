import fs from 'fs'
import { db, container } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { analyze } from '../analyze'

analyze(() =>
  container(db, () => getModuleCondensedRepository(db).find())
).then((res) => {
  fs.writeFileSync('results.json', JSON.stringify(res))
})
