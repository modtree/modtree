import { config as dotenvConfig } from 'dotenv'
import { DataSource } from 'typeorm'
import { DataSourceOptions } from '../../types/modtree'
import { ModuleCondensed, Module, User, Degree, Graph } from '../entity'
import { getDatabaseType, getDatabasePort, getPrefix, boxLog } from './utils'

/** read from .env file (no matter what NODE_ENV) */
dotenvConfig()

/**
 * generate a config based on the database type
 * @param {SupportedDatabases} type
 * @return {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const prefix = (e: string): string => process.env[getPrefix() + e] || ''
  const almostDataSourceOptions = {
    type: getDatabaseType(prefix('DATABASE_TYPE')),
    rootDir: process.cwd(),
    port: getDatabasePort(),
    entities: [ModuleCondensed, Module, User, Degree, Graph],
    migrations: ['dist/migrations/*.{js,ts}'],
    username: prefix('USERNAME'),
    password: prefix('PASSWORD'),
    host: prefix('HOST'),
    database: prefix('ACTIVE_DATABASE'),
    restoreSource: prefix('RESTORE_SOURCE'),
    synchronize: prefix('SYNC') === 'true',
    migrationsRun: prefix('MIGRATIONS_RUN') === 'true',
  }
  boxLog(almostDataSourceOptions)
  return almostDataSourceOptions
}

export const config = getConfig()

export const db = new DataSource({
  ...config,
  // required for Postgres deployment
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})
