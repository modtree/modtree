import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from './config'
import { ModuleCondensed, Module, User, ModuleCheck } from './entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: [User, ModuleCondensed, Module, ModuleCheck],
  migrations: [],
  subscribers: [],
})

export const db = {
  open: async () => AppDataSource.initialize(),
  close: async () => AppDataSource.destroy(),
}

export const container = async (fn: () => Promise<void>) => {
  await db.open()
  await fn()
  await db.close()
}
