import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: 'modtree_1',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: {
    ca: process.env.MYSQL_SERVER_CA,
    cert: process.env.MYSQL_CLIENT_CERT,
    key: process.env.MYSQL_CLIENT_KEY,
  },
})
