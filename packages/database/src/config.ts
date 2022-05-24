import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { DatabaseType, DataSource } from 'typeorm'
import { box } from './cli'

const rootDir = process.cwd()
const env = process.env.NODE_ENV
const envFile = `.env${env ? `.${env}` : ''}`

// read from the correct .env file based on NODE_ENV
dotenvConfig({ path: resolve(rootDir, envFile) })

type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>
type DataSourceOptions = {
  type: SupportedDatabases
  rootDir: string
  restoreSource: string
  port: number
  database: string
  username: string
  password: string
  host: string
  migrations: string[]
  entities: string[]
}

/**
 * gets project database type from .env
 * @param {string} env
 * @return {DatabaseType}
 */
function getDatabaseType(): SupportedDatabases {
  const env = process.env.DATABASE_TYPE
  if (env === 'postgres') return env
  return 'mysql'
}

/**
 * @return {string} the default port of each database
 */
function getDatabasePort(): number {
  const env = process.env.DATABASE_TYPE
  if (env === 'postgres') return 5432
  return 3306
}

/**
 * prints the blue box before each run
 * @param {string} database
 * @param {string} type
 */
function boxLog(database: string, type: string) {
  const output = [
    `Env File: ${envFile}`,
    `Database: ${database}`,
    `Engine:   ${type}`,
  ]
  box.blue(output.join('\n'))
}

/**
 * generate a config based on the database type
 * @param {SupportedDatabases} type
 * @return {DataSourceOptions}
 */
function getConfig(type: SupportedDatabases): DataSourceOptions {
  const key = (e: string) => `${type.toUpperCase()}_${e}`
  const env = (e: string) => process.env[key(e)]
  const config = {
    rootDir,
    type,
    port: parseInt(env('PORT') || 'NaN') || base.port,
    username: env('USERNAME') || 'default_user',
    password: env('PASSWORD') || 'default_pass',
    host: env('HOST') || 'default_host',
    database: env('ACTIVE_DATABASE') || 'default_database',
    restoreSource: env('RESTORE_SOURCE') || 'default_restore',
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
  }
  boxLog(config.database, config.type)
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
  port: config.port,
  database: config.database,
  username: config.username,
  password: config.password,
  synchronize: true,
  logging: false,
  entities: config.entities,
  migrations: config.migrations,
  subscribers: [],
})
