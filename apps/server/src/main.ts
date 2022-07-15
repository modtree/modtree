import { Api } from '@modtree/repos'
import { db } from '@modtree/typeorm-config'
import { getApp } from './app'
import { checkhealth } from './utils/check-health'
import { connect } from './utils/connect'

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
  api = new Api(db)
  const app = getApp(api)
  checkhealth(api)
  app.listen(process.env.PORT || 8080)
})
