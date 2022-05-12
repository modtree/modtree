import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { log } from './cli'
import { config } from './config'
import { ModuleCondensed, Module, User } from './entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: [ModuleCondensed, Module, User],
  migrations: [],
  subscribers: [],
})

export const container = async (fn: () => Promise<any>): Promise<any> => {
  // if already initialized, reattach to old instance
  if (AppDataSource.isInitialized) {
    log.cyan('already initialized, reattaching.')
    const res = await fn()
    return res
  }
  // if not initialized, kickstart a new instance
  const res = await AppDataSource.initialize()
    .then(async () => {
      /** successfully initialize database connection */
      log.cyan('initialized a new connection to database.')
      const res = await fn()
      return res
    })
  /** failed to initialize database connection */
    .catch((error) => {
      console.log(error)
      log.red('typeorm failed to initialize connection to database.')
    })
  return res
}
