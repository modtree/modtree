export { dump } from './dump'
export { restore } from './restore'
export { remove } from './remove'
export { wipe } from './wipe'
import { config } from '../config'
import { createConnection, Connection } from 'mysql2/promise'
import { DatabaseType } from 'typeorm'

const initConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...initConfig,
  database,
})

class Sql {
  type: DatabaseType

  static async removeTableQuery(con: Connection, table: string) {
    await con.query(`DROP TABLE IF EXISTS ${table}`)
  }

  /** instantiate a new Sql class */
  constructor(type: DatabaseType) {
    this.type = type
  }

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  async removeTable(database: string, table: string) {
    const con = await createConnection(connectionConfig(database))
    await Sql.removeTableQuery(con, table)
    await con.end()
  }

  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  async removeTables(database: string, tables: string[]) {
    const con = await createConnection(connectionConfig(database))
    await Promise.all(tables.map((table) => Sql.removeTableQuery(con, table)))
    await con.end()
  }
}

export const sql = new Sql(config.type)
