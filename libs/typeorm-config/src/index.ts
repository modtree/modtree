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
  restoreSource: 'mod3.sql',
  synchronize: false,
  migrationsRun: false,
}

const nodeEnv = process.env['NODE_ENV']
const getConfigFromEnv = (): ConfigFromEnv =>
  ['production', 'development', 'test'].includes(nodeEnv)
    ? env[nodeEnv]
    : env.empty

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
