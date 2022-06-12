import 'dotenv/config'
import { DataSource } from 'typeorm'
import { ModuleCondensed, Module, User, Degree, Graph } from '@modtree/entity'
import { DataSourceOptions } from '@modtree/types'
import { getDatabaseType, getDatabasePort, getPrefix, boxLog } from './utils'

/**
 * generate a config based on the database type
 *
 * @returns {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const prefix = (e: string) => process.env[getPrefix() + e]
  const almost = {
    type: getDatabaseType(),
    rootDir: process.cwd(),
    port: getDatabasePort(),
    entities: [ModuleCondensed, Module, User, Degree, Graph],
    migrations: ['dist/migrations/*.{js,ts}'],
    username: prefix('USERNAME'),
    password: prefix('PASSWORD'),
    host: prefix('HOST') || 'localhost',
    database: prefix('ACTIVE_DATABASE') || 'mt_test',
    restoreSource: prefix('RESTORE_SOURCE') || 'postgres-modules-only.sql',
    synchronize: prefix('SYNC') !== 'false', // default to true
    migrationsRun: prefix('MIGRATIONS_RUN') === 'true', // default to false
    extra:
      prefix('USE_SSL') === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : undefined,
  }
  console.log('getConfig:', almost)
  return almost
}

export const config = getConfig()

export const db = new DataSource({
  ...config,
})

export * from './data-source'
