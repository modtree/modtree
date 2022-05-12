import { config } from '../config'

export const initConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

export const connectionConfig = {
  ...initConfig,
  database: config.database,
}
