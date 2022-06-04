import fs from 'fs'
import { container } from '../../data-source'
import { db } from '../../config'
import { ModuleCondensedRepository } from '../../repository/ModuleCondensed'
import { analyze } from '../analyze'

analyze(() => container(db, () => ModuleCondensedRepository(db).find())).then(
  (res) => {
    fs.writeFileSync('results.json', JSON.stringify(res))
  }
)
