import fs from 'fs'
import { db } from '@modtree/typeorm-config'
import { container } from '../../data-source'
import { getModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { analyze } from '../analyze'

analyze(() =>
  container(db, () => getModuleCondensedRepository(db).find())
).then((res) => {
  fs.writeFileSync('results.json', JSON.stringify(res))
})
