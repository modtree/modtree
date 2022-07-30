import 'dotenv/config'
import { DataSource } from 'typeorm'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import {
  ModuleCondensed,
  Module,
  User,
  Degree,
  Graph,
  ModuleFull,
} from '@modtree/types'

type NodeEnv = 'test' | 'development' | 'production'

const p = process.env
const base = {
  entities: [ModuleCondensed, Module, User, Degree, Graph, ModuleFull],
  synchronize: false,
  migrationsRun: false,
  migrations: [],
}

const env = {
  test: {
    port: parseInt(p.TEST_POSTGRES_PORT || '5432'),
    host: p.TEST_POSTGRES_HOST,
    username: p.TEST_POSTGRES_USERNAME,
    password: p.TEST_POSTGRES_PASSWORD,
    database: p.TEST_POSTGRES_DATABASE,
    ...base,
  },
  development: {
    port: parseInt(p.DEVELOPMENT_POSTGRES_PORT || '5432'),
    host: p.DEVELOPMENT_POSTGRES_HOST,
    username: p.DEVELOPMENT_POSTGRES_USERNAME,
    password: p.DEVELOPMENT_POSTGRES_PASSWORD,
    database: p.DEVELOPMENT_POSTGRES_DATABASE,
    ...base,
  },
  production: {
    port: parseInt(p.PRODUCTION_POSTGRES_PORT || '5432'),
    host: p.PRODUCTION_POSTGRES_HOST,
    username: p.PRODUCTION_POSTGRES_USERNAME,
    password: p.PRODUCTION_POSTGRES_PASSWORD,
    database: p.PRODUCTION_POSTGRES_DATABASE,
    ...base,
  },
}

/**
 * exported for test-env and sql
 */
export const config: Record<NodeEnv, PostgresConnectionOptions> = {
  test: { type: 'postgres', ...env.test, synchronize: true },
  development: { type: 'postgres', ...env.development },
  production: {
    type: 'postgres',
    ...env.production,
    extra: { ssl: { rejectUnauthorized: false } },
  },
}

export const source = {
  test: new DataSource(config.test),
  development: new DataSource(config.development),
  production: new DataSource(config.production),
}

/**
 * custom source creator (mostly used in tests to isolate databases)
 *
 * @param {string} database to use
 * @returns {DataSource}
 */
export const getSource = (database: string): DataSource =>
  new DataSource({ ...config.test, database })

export const testDb = source.test
