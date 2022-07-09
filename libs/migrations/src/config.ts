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
import { migrations } from '../snapshots'

const p = process.env
const base = {
  entities: [ModuleCondensed, Module, User, Degree, Graph, ModuleFull],
  migrations,
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
}

const source = {
  development: new DataSource({
    type: 'postgres',
    synchronize: false,
    migrationsRun: false,
    ...env.development,
  }),
}

export const migrationSource = source.development
