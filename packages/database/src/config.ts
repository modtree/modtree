import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'
import { box } from './cli'

const rootDir = process.cwd()
const env = process.env.NODE_ENV
const envFile = `.env${env ? `.${env}` : ''}`

// read from the correct .env file based on NODE_ENV
dotenvConfig({ path: resolve(rootDir, envFile) })

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
  const key = (e: string) => `${type.toUpperCase()}_${e}`
  const env = (e: string) => process.env[key(e)]
  const shared = {
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
  }
  const config = {
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
  // show which env file was loaded
  // which database is being used
  const output = [`Env File: ${envFile}`, `Database: ${env('ACTIVE_DATABASE')}`]
  box.blue(output.join('\n'))
  return config
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
