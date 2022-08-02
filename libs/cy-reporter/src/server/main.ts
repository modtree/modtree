import { Api } from '@modtree/repos'
import { getApp } from './app'
import { connect } from './connect'
import { db } from '../data-source'

/**
 * this exact instance of Api will be used in trpc routes
 */
export let api: Api

const config = {
  dataSource: db,
  maxRetries: 15,
  intervalInMilliseconds: 3000,
}

connect(config, async (db) => {
  /** api is only instantiated here */
  const app = getApp()
  console.log('server/main: server started listening')
  app.listen(process.env.PORT || 8081)
})
