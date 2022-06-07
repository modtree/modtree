import { DatabaseType } from 'typeorm'

export type ModtreeFunction<T> = () => Promise<T>
type Data = string | number | boolean
type BaseArgs = Partial<Record<string, Data>>

export type ModtreeFunctionWithArgs<A extends BaseArgs, T> = (
  args: A
) => Promise<T>

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
