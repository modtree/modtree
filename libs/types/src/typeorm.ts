import type { DatabaseType, DataSourceOptions as DSO } from 'typeorm'
import type { Modify } from './utils'

export type AsyncFunction<T> = () => Promise<T>

export type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>

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
