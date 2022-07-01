import type { DatabaseType } from 'typeorm'

export type AsyncFunction<T> = () => Promise<T>

export type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>

export type DataSourceOptions = {
  type: SupportedDatabases
  rootDir: string
  restoreSource: string
  database: string
  username?: string
  password?: string
  host: string
  migrations: string[]
  entities: any[]
  synchronize: boolean
  migrationsRun: boolean
  extra?: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}
