import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { box } from './cli'

const env = process.env.NODE_ENV
const suffix = env ? `.${env}` : ''
const envFile = `.env${suffix}`
const rootDir = process.cwd()
const envPath = resolve(rootDir, envFile)
dotenvConfig({ path: envPath })

// show which env file was loaded
// which database is being used
const output = [
  `Env File: ${envFile}`,
  `Database: ${process.env.MYSQL_ACTIVE_DATABASE}`,
]
box.blue(output.join('\n'))

export const config = {
  rootDir,
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_ACTIVE_DATABASE,
  restoreSource: process.env.MYSQL_RESTORE_SOURCE,
  server_ca: process.env.MYSQL_SERVER_CA,
  client_cert: process.env.MYSQL_CLIENT_CERT,
  client_key: process.env.MYSQL_CLIENT_KEY,
  entities: ['src/entity/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
}

export const db = config.database
