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
  const env = (value: string) => process.env[`${type.toUpperCase()}_${value}`]
  const shared = {
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
  }
  return {
    ...shared,
    type,
    rootDir,
    port: parseInt(env('PORT')) || base.port,
    username: env('USERNAME'),
    password: env('PASSWORD'),
    host: env('HOST'),
    database: env('ACTIVE_DATABASE'),
    restoreSource: env('RESTORE_SOURCE'),
    server_ca: env('SERVER_CA'),
    client_cert: env('CLIENT_CERT'),
    client_key: env('CLIENT_KEY'),
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
