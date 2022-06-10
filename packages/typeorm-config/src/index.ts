import { config as dotenvConfig } from 'dotenv'
import { DataSource } from 'typeorm'
import { ModuleCondensed, Module, User, Degree, Graph } from '@modtree/entity'
import { DataSourceOptions } from '@modtree/types'
import { getDatabaseType, getDatabasePort, getPrefix, boxLog } from './utils'

/** read from .env file (no matter what NODE_ENV) */
dotenvConfig()

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
    host: prefix('HOST'),
    database: prefix('ACTIVE_DATABASE'),
    restoreSource: prefix('RESTORE_SOURCE'),
    synchronize: prefix('SYNC') === 'true',
    migrationsRun: prefix('MIGRATIONS_RUN') === 'true',
    extra:
      prefix('USE_SSL') === 'true'
        ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
        : undefined,
  }
  boxLog(almost)
  return almost
}

export const config = getConfig()

export const db = new DataSource({
  ...config,
})
