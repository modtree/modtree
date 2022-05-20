import { connectionConfig, initConfig } from './config'
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

export namespace remove {
  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  export async function tables(database: string, tables: string[]) {
    const con = await createConnection(connectionConfig(database))
    const q = []
    tables.forEach((table) => {
      q.push(removeTable(con, table))
    })
    await Promise.all(q)
    await con.end()
  }

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  export async function table(database: string, table: string) {
    const con = await createConnection(connectionConfig(database))
    await removeTable(con, table)
    await con.end()
  }
  /**
   * drops the database
   * @param {string} database
   */
  export async function database(database: string) {
    await createConnection(initConfig).then(async (connection) => {
      // drop the database if it exists
      await connection
        .query(`DROP DATABASE ${database};`)
        .catch(() => 'database already non-existent')
      await connection.end()
    })
  }
}
