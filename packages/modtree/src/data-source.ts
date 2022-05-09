import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  database: 'modtree_1',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
})
