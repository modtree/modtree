import 'dotenv/config'
import { DataSource } from 'typeorm'
import { ModuleCondensed, Module, User, Degree, Graph } from '@modtree/entity'
import { DataSourceOptions } from '@modtree/types'
import { getPrefix } from './utils'
import fs from 'fs'
import { join } from 'path'

function readJson(target: DataSourceOptions) {
  const nodeEnv = process.env['NODE_ENV']
  if (!nodeEnv) return
  const filepath = join(process.cwd(), 'modtree.config.json')
  const modtreeConfigJson = JSON.parse(fs.readFileSync(filepath).toString())
  Object.assign(target, modtreeConfigJson[nodeEnv])
}

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
    rootDir: process.cwd(),
    port: 5432,
    entities: [ModuleCondensed, Module, User, Degree, Graph],
    migrations: [],
    username: '',
    password: '',
    host: '',
    database: 'mt_test',
    restoreSource: 'postgres-modules-only.sql',
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

export * from './data-source'
