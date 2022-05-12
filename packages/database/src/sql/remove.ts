import { connectionConfig } from '.'
import { createConnection, Connection } from 'mysql2/promise'

/**
 * removes a one table from a mysql database
 * @param {Connection} con
 * @param {string} table name
 */
const removeTable = async (con: Connection, table: string) => {
  const sql = `DROP TABLE IF EXISTS ${table}`
  await con.query(sql).then(() => {
    console.log(`[${table}] table deleted.`)
  })
}

/**
 * removes a list of tables from a mysql database
 * @param {string[]} tables
 */
export async function remove(tables: string[]) {
  const con = await createConnection(connectionConfig)
  const q = []
  tables.forEach((table) => {
    q.push(removeTable(con, table))
  })
  await Promise.all(q)
  await con.end()
  console.log('finished setup')
}
