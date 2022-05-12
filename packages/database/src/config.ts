import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { box } from './cli'

const env = process.env.NODE_ENV
const suffix = env ? `.${env}` : ''
const envFile = `.env${suffix}`
const envPath = resolve(process.cwd(), envFile)
dotenvConfig({ path: envPath })

const output = [
  `Env File: ${envFile}`,
  `Database: ${process.env.MYSQL_ACTIVE_DATABASE}`,
]

/* the following will be the pre-cursor for every run */
// print newline for test runs (because jest's logs are weird)
if (env === 'test') {
  console.log('')
}
// show which env file was loaded
// which database is being used
box.blue(output.join('\n'))

export const config = {
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_ACTIVE_DATABASE,
  server_ca: process.env.MYSQL_SERVER_CA,
  client_cert: process.env.MYSQL_CLIENT_CERT,
  client_key: process.env.MYSQL_CLIENT_KEY,
}
