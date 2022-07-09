import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 4000,
  username: 'web',
  password: 'web',
  database: 'web',
  synchronize: false,
  migrationsRun: false,
  entities: [],
})
