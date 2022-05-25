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
  synchronize: boolean
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
 * @param {DataSourceOptions} config
 */
function boxLog(config: DataSourceOptions) {
  const output = [
    `Env File:    ${envFile}`,
    `Database:    ${config.database}`,
    `Engine:      ${config.type}`,
    `Synchronize: ${config.synchronize}`,
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
  const sync = process.env.SYNCHRONIZE === 'true'
  const config = {
    rootDir,
    type,
    port: parseInt(env('PORT') || '') || base.port,
    username: env('USERNAME') || '',
    password: env('PASSWORD') || '',
    host: env('HOST') || '',
    database: env('ACTIVE_DATABASE') || '',
    restoreSource: env('RESTORE_SOURCE') || '',
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: sync,
    migrationsRun: !sync,
  }
  boxLog(config)
  return config
}

const base = {
  type: getDatabaseType(),
  port: getDatabasePort(),
}

export const config = getConfig(base.type)

export const db = new DataSource({
  ...config,
  logging: false,
  subscribers: [],
})
