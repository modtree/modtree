import { config } from './config'
import { Connection } from 'mysql'
import { Connection as Connection2 } from 'mysql2/promise'

export const initConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

export const connectionConfig = {
  ...initConfig,
  database: config.database,
}

export const deleteTable = async (con: Connection, table: string) => {
  const sql = `DROP TABLE IF EXISTS ${table}`
  con.query(sql, function (err) {
    if (err) console.warn(err)
    console.log(`[${table}] table deleted.`)
  })
}

export const deleteTable2 = async (con: Connection2, table: string) => {
  const sql = `DROP TABLE IF EXISTS ${table}`
  await con.query(sql).then(() => {
    console.log(`[${table}] table deleted.`)
  })
}
