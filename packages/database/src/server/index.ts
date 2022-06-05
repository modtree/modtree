import { db } from '../config'
import app from './app'

db.initialize().then(async () => {
  app.listen(process.env.PORT || 8080)
})
