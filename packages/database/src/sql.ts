import { config } from './config'
import { Connection } from 'mysql'

export const connectionConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
}

export const deleteTable = async (con: Connection, table: string) => {
  const sql = `DROP TABLE IF EXISTS ${table}`
  con.query(sql, function (err) {
    if (err) console.warn (err)
    console.log(`[${table}] table deleted.`)
  })
}
