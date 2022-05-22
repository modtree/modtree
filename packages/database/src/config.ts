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
 * @returns {string} the default port of each database
 */
function getDatabasePort(): number {
  const env = process.env.DATABASE_TYPE
  if (env === 'postgres') return 5432
  return 3306
}

function getConfig(type: SupportedDatabases) {
  const shared = {
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
  }
  console.log(process.env.MYSQL_USERNAME)
  if (type === 'mysql') {
    return {
      ...shared,
      type,
      rootDir,
      port: parseInt(process.env.MYSQL_PORT) || base.port,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_ACTIVE_DATABASE,
      restoreSource: process.env.MYSQL_RESTORE_SOURCE,
      server_ca: process.env.MYSQL_SERVER_CA,
      client_cert: process.env.MYSQL_CLIENT_CERT,
      client_key: process.env.MYSQL_CLIENT_KEY,
    }
  }
  if (type === 'postgres') {
    return {
      ...shared,
      type,
      rootDir,
      port: parseInt(process.env.POSTGRES_PORT) || base.port,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_ACTIVE_DATABASE,
      restoreSource: process.env.POSTGRES_RESTORE_SOURCE,
      entities: ['src/entity/*.ts'],
      migrations: ['src/migrations/**/*.ts'],
    }
  }
}

const base = {
  type: getDatabaseType(),
  port: getDatabasePort(),
}

export const config = getConfig(base.type)

export const db = new DataSource({
  type: config.type,
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

