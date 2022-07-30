import type { DatabaseType } from 'typeorm'

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

export type DataSourceOptions = {
  type: SupportedDatabases
  entities: Function[]
  migrations: any[]
  migrationsRun: boolean
  restoreSource: string
  username?: string
  password?: string
  database: string
  port?: number
  host: string
  synchronize: boolean
  extra?: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}
