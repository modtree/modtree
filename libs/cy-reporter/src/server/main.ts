import { getApp } from './app'
import { connect } from './connect'
import { db } from '../data-source'
import { Repository } from 'typeorm'
import { CypressRun } from '../entity'

/**
 * this exact instance of Api will be used in trpc routes
 */
export let repo: Repository<CypressRun>

const config = {
  dataSource: db,
  maxRetries: 15,
  intervalInMilliseconds: 3000,
}

connect(config, async (db) => {
  repo = new Repository(CypressRun, db.manager)
  const app = getApp()
  console.log('server/main: server started listening')
  app.listen(process.env.PORT || 8081)
})
