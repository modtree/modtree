import { db } from '@modtree/typeorm-config'
import { getApp } from './server/app'

console.log('Initializing connection to database...')
db.initialize()
  .then(async () => {
    console.log('Connection to database established.')
    const app = getApp()
    app.listen(process.env.PORT || 8080)
  })
  .catch(() => {
    console.log('Failed to initialize connection to database.')
  })
