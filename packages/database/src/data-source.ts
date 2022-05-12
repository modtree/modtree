import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { log } from './cli'
import { config } from './config'
import { ModuleCondensed, Module, User, Degree } from './entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: [ModuleCondensed, Module, User, Degree],
  migrations: [],
  subscribers: [],
})

export const db = {
  open: async () => AppDataSource.initialize(),
  close: async () => AppDataSource.destroy(),
}

export const container = async (fn: () => Promise<any>): Promise<any> => {
  const res = await AppDataSource.initialize()
    .then(async () => {
      /** successfully initialize database connection */
      const res = await fn()
      AppDataSource.destroy()
      return res
    })
  /** failed to initialize database connection */
    .catch((error) => {
      console.log(error)
      log.red('typeorm failed to initialize connection to database.')
    })
  return res
}
