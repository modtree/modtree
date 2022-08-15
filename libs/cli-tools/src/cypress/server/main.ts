import { connect } from '@modtree/connect'
import { config } from '@modtree/typeorm-config'
import { CypressRun } from '@modtree/types'
import { getApp } from './app'
import { useProd } from '../config'
import { Repository, DataSource } from 'typeorm'

const db = new DataSource({
  ...(useProd ? config.production : config.development),
  // only use the CypressRun entity here
  entities: [CypressRun],
})

export let repo: Repository<CypressRun>

const connectionConfig = {
  dataSource: db,
  maxRetries: 15,
  intervalInMilliseconds: 3000,
  name: 'cy-reporter',
  port: 8081,
}

connect(connectionConfig, async (db) => {
  repo = new Repository(CypressRun, db.manager)
  const app = getApp()
  const port = process.env.PORT || connectionConfig.port
  console.log('cy-reporter: proxy server started @ port', port)
  app.listen(port)
})
