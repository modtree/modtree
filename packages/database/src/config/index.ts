import { config as dotenvConfig } from 'dotenv'
import { DataSource } from 'typeorm'
import { DataSourceOptions } from '../../types/modtree'
import { ModuleCondensed, Module, User, Degree, Graph } from '../entity'
import { getDatabaseType, getDatabasePort, boxLog, getPrefix } from './utils'

/** read from .env file (no matter what NODE_ENV) */
dotenvConfig()

/**
 * generate a config based on the database type
 * @param {SupportedDatabases} type
 * @return {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const prefix = getPrefix()
  console.log(prefix)
  const env = (e: string): string => process.env[prefix + e] || ''
  const almostDataSourceOptions = {
    type: getDatabaseType(env('DATABASE_TYPE')),
    rootDir: process.cwd(),
    port: getDatabasePort(),
    entities: [ModuleCondensed, Module, User, Degree, Graph],
    migrations: ['dist/migrations/*.{js,ts}'],
    username: env('USERNAME'),
    password: env('PASSWORD'),
    host: env('HOST'),
    database: env('ACTIVE_DATABASE'),
    restoreSource: env('RESTORE_SOURCE'),
    synchronize: env('SYNC') === 'true',
    migrationsRun: env('MIGRATIONS_RUN') === 'true',
  }
  boxLog(almostDataSourceOptions)
  return almostDataSourceOptions
}

export const config = getConfig()

export const db = new DataSource({
  ...config,
  migrationsRun: false,
  logging: false,
  subscribers: [],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})
