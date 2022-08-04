import './env'
import { config } from '@modtree/typeorm-config'
import { DataSource, Repository } from 'typeorm'
import { CypressRun } from './entity'

const useProd = process.env['CYPRESS_REPORTER_URL']?.includes('localhost')

export const db = new DataSource({
  ...(useProd ? config.production : config.development),
  // only use the CypressRun entity here
  entities: [CypressRun],
})

// initialize database and repo
const dbInit = db.initialize()
const repo = dbInit.then(() => new Repository(CypressRun, db.manager))
export const init = Promise.all([repo, dbInit]).then(([repo]) => repo)
