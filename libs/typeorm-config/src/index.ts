import 'dotenv/config'
import { DataSource } from 'typeorm'
import {
  ModuleCondensed,
  Module,
  User,
  Degree,
  Graph,
  ModuleFull,
} from '@modtree/entity'
import { DataSourceOptions } from '@modtree/types'
import { getPrefix } from './utils'
import fs from 'fs'
import { rawJson } from './utils'
import { join } from 'path'

/**
 * reads two json files at workspace root:
 *   1. modtree.config.json
 *   2. admin.config.json (not git-indexed)
 *
 * NODE_ENV decides which key of that JSON is read.
 */
function readJson(target: DataSourceOptions) {
  /**
   * do nothing if there's no NODE_ENV
   */
  const nodeEnv = process.env['NODE_ENV']
  if (!nodeEnv) return
  /**
   * read from modtree.config.json first
   */
  const modtreeConfigJson = rawJson('modtree.config.json')
  Object.assign(target, modtreeConfigJson[nodeEnv])
  /**
   * if admin.config.json exists, then use it to override
   */
  if (fs.existsSync('admin.config.json')) {
    const adminConfigJson = rawJson('admin.config.json')
    Object.assign(target, adminConfigJson[nodeEnv])
  }
}

/**
 * reads the .env file, wherever it is
 * (known to work when placed at /apps/server/.env)
 *
 * reads environment variables to json.
 *
 * example:
 * ``` .env
 * TEST_POSTGRES_USERNAME=my_cool_username
 * ```
 * will become
 * ``` config output
 * {
 *   "test": {
 *     "postgres": {
 *       "username": "my_cool_username"
 *     }
 *   }
 * }
 * ```
 */
function readEnv(target: DataSourceOptions) {
  const prefix = (e: string): string | undefined => process.env[getPrefix() + e]
  const env: Partial<DataSourceOptions> = {
    username: prefix('USERNAME'),
    password: prefix('PASSWORD'),
    host: prefix('HOST'),
    database: prefix('ACTIVE_DATABASE'),
  }
  if (env.username) target.username = env.username
  if (env.password) target.password = env.password
  if (env.host) target.host = env.host
  if (env.database) target.database = env.database
  /**
   * for postgres deployments
   */
  if (prefix('USE_SSL') === 'true') {
    target.extra = {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  }
}

/**
 * generate a config based on the database type
 *
 * @returns {DataSourceOptions}
 */
function getConfig(): DataSourceOptions {
  const base: DataSourceOptions = {
    type: 'postgres',
    rootDir: join(__dirname, '../../..'),
    entities: [ModuleCondensed, Module, User, Degree, Graph, ModuleFull],
    migrations: [],
    username: '',
    password: '',
    host: 'localhost',
    database: 'mt_test',
    restoreSource: 'mod3.sql',
    synchronize: true,
    migrationsRun: false,
  }
  readJson(base)
  readEnv(base)
  return base
}

export const config = getConfig()

export const db = new DataSource({
  ...config,
})

/**
 * custom source creator
 *
 * @param {string} database to use
 * @returns {DataSource}
 */
export function getSource(database: string): DataSource {
  const dataSourceOptions = {
    ...config,
    database,
  }
  return new DataSource(dataSourceOptions)
}
