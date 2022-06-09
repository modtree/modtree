import type { DatabaseType } from 'typeorm'

export type AsyncFunction<T> = () => Promise<T>

type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>

type DataSourceOptions = {
  type: SupportedDatabases
  rootDir: string
  restoreSource: string
  port: number
  database: string
  username: string
  password: string
  host: string
  migrations: string[]
  entities: any[]
  synchronize: boolean
  migrationsRun: boolean
}
