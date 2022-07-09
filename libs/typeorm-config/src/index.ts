import 'dotenv/config'
import { DataSource } from 'typeorm'
import {
  ModuleCondensed,
  Module,
  User,
  Degree,
  Graph,
  ModuleFull,
  DataSourceOptions,
  ConfigFromEnv,
} from '@modtree/types'
import { resolve } from 'path'
import { env } from './env'

const defaultConfig: DataSourceOptions = {
  type: 'postgres',
  rootDir: resolve(__dirname, '../../..'),
  entities: [ModuleCondensed, Module, User, Degree, Graph, ModuleFull],
  username: '',
  password: '',
  migrations: [],
  host: 'localhost',
  database: 'mt_test',
  restoreSource: '20220709.sql',
  synchronize: false,
  migrationsRun: false,
}

function getConfigFromEnv(): ConfigFromEnv {
  const nodeEnv = process.env['NODE_ENV']
  switch (nodeEnv) {
    case 'production':
      return env.production
    case 'development':
      return env.development
    case 'test':
      return env.test
    default:
      return env.empty
  }
}

/**
 * generate a config based on the database type
 *
 * @returns {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const base = defaultConfig
  const { ssl, ...direct } = getConfigFromEnv()
  /**
   * `direct` is directly assignable to base, since it has all the right keys
   */
  Object.assign(base, direct)
  /**
   * ssl requires more processing
   */
  if (ssl) {
    base.extra = {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  }
  /**
   * always synchronize for tests
   */
  if (process.env['NODE_ENV'] === 'test') {
    base.synchronize = true
  }
  return base
}

export const config = getConfig()
export const db = new DataSource(config)

/**
 * custom source creator (mostly used in tests to isolate databases)
 *
 * @param {string} database to use
 * @returns {DataSource}
 */
export const getSource = (database: string): DataSource =>
  new DataSource({
    ...config,
    database,
  })
