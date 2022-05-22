import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'
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

type SupportedDatabases = 'mysql' | 'postgres'

/**
 * gets project database type from .env
 * @param {string} env
 */
function getDatabaseType(): SupportedDatabases {
  const env = process.env.DATABASE_TYPE
  if (env === 'postgres') return env
  return 'mysql'
}

/**
 * @returns {number} the default port of each database
 */
function getDatabasePort(): number {
  const env = process.env.DATABASE_TYPE
  if (env === 'postgres') return 5432
  return 3306
}

const base = {
  type: getDatabaseType(),
  port: getDatabasePort(),
}

function getConfig(type: SupportedDatabases) {
  if (type === 'postgres') {
    return {
      ...base,
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
  }
  if (type === 'mysql') {
    return {
      ...base,
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
  }
}

export const config = getConfig(base.type)

export const db = new DataSource({
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: config.entities,
  migrations: config.migrations,
  subscribers: [],
})
