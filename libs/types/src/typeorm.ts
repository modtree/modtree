import type { DatabaseType, DataSourceOptions as DSO } from 'typeorm'
import type { Modify } from './utils'

export type AsyncFunction<T> = () => Promise<T>

export type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>

export type ConfigFromEnvMap = {
  database: string
  username: string
  password: string
  host: string
  port: string
  ssl: string
}

export type ConfigFromEnv = {
  database: string
  username: string
  password: string
  host: string
  port: number
  ssl: boolean
}

export type ConfigsFromEnv = {
  production: ConfigFromEnv
  development: ConfigFromEnv
  test: ConfigFromEnv
  empty: ConfigFromEnv
}

export type DataSourceOptions = Modify<
  DSO,
  {
    type: SupportedDatabases
    rootDir: string
    restoreSource: string
    username?: string
    password?: string
    database: string
    port?: number
    host: string
    extra?: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
>
