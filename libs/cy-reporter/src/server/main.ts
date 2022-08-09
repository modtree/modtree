import { getApp } from './app'
import { connect } from '@modtree/connect'
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
  intervalInMilliseconds: 2999,
  port: 8081,
}

connect(config, async (db) => {
  repo = new Repository(CypressRun, db.manager)
  const app = getApp()
  const port = process.env.PORT || config.port
  console.log('cy-reporter: proxy server started @ port', port)
  app.listen(port)
})
