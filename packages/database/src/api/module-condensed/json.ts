import fs from 'fs'
import { db, container } from '@modtree/typeorm-config'
import { getModuleCondensedRepository } from '@modtree/repo-module'
import { analyze } from '../analyze'

analyze(() =>
  container(db, () => getModuleCondensedRepository(db).find())
).then((res) => {
  fs.writeFileSync('results.json', JSON.stringify(res))
})
