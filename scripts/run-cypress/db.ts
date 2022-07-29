import 'dotenv/config'
import { Entity, PrimaryGeneratedColumn, Column, DataSource } from 'typeorm'

console.log(process.env.PRODUCTION_POSTGRES_USERNAME)

@Entity({ name: 'cypress_run' })
/** ModuleCondensed entity */
export class CypressRun {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  file: string

  // Numeric part of moduleCode
  @Column('integer')
  timestamp: number

  @Column('text')
  gitHash: string

  @Column('boolean')
  pass: boolean
}

const p = process.env
const base = {
  entities: [CypressRun],
  synchronize: true,
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

console.log(env)

const useProd = false

export const db = useProd ? source.production : source.development
