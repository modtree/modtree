import { config as dotenvConfig } from 'dotenv'
import { log } from './cli'
import { resolve } from 'path'

const env = process.env.NODE_ENV
const suffix = env ? `.${env}` : ''
const envFile = `.env${suffix}`
const envPath = resolve(process.cwd(), envFile)
dotenvConfig({ path: envPath })

log.magenta(`\nusing <${envFile}> environment`)
log.magenta(`using <${process.env.MYSQL_ACTIVE_DATABASE}> database`)

export const config = {
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_ACTIVE_DATABASE,
  server_ca: process.env.MYSQL_SERVER_CA,
  client_cert: process.env.MYSQL_CLIENT_CERT,
  client_key: process.env.MYSQL_CLIENT_KEY,
}
