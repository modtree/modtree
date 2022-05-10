import { config } from './config'
import mysqldump from 'mysqldump'

mysqldump({
  connection: {
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
  },
  dumpToFile: './export.sql',
})
