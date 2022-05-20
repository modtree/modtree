import { config } from '../config'

export const initConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

export const connectionConfig = (database?: string) => ({
  ...initConfig,
  database: database || config.database,
})
