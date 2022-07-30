import 'dotenv/config'
import { DataSource } from 'typeorm'
import {
  ModuleCondensed,
  Module,
  User,
  Degree,
  Graph,
  ModuleFull,
} from '@modtree/types'
import { CypressRun } from '@modtree/cy-reporter'
import { migrations } from '../snapshots'

const p = process.env
const base = {
  entities: [
    ModuleCondensed,
    Module,
    User,
    Degree,
    Graph,
    ModuleFull,
    CypressRun,
  ],
  migrations,
  synchronize: false,
  migrationsRun: false,
}

const env = {
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

const source = {
  development: new DataSource({
    type: 'postgres',
    ...env.development,
  }),
  production: new DataSource({
    type: 'postgres',
    ...env.production,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
}

const useProd = false

export const migrationSource = useProd ? source.production : source.development
