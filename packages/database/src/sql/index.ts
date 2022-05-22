export { dump } from './dump'
export { restore } from './restore'
export { remove } from './remove'
export { wipe } from './wipe'
import { config } from '../config'
import { createConnection, Connection } from 'mysql2/promise'
import { DatabaseType } from 'typeorm'

const noDatabaseConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

class Query {
  static async dropTable(con: Connection, table: string) {
    await con.query(`DROP TABLE IF EXISTS ${table}`)
  }
  static async dropDatabase(con: Connection, database: string) {
    await con.query(`DROP DATABASE ${database}`)
  }
  static async createDatabase(con: Connection, database: string) {
    await con.query(`CREATE DATABASE ${database}`)
  }
}

class Sql {
  type: DatabaseType

  /** instantiate a new Sql class */
  constructor(type: DatabaseType) {
    this.type = type
  }

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  async dropTable(database: string, table: string) {
    const con = await createConnection(connectionConfig(database))
    await Query.dropTable(con, table)
    await con.end()
  }

  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  async dropTables(database: string, tables: string[]) {
    const con = await createConnection(connectionConfig(database))
    await Promise.all(tables.map((table) => Query.dropTable(con, table)))
    await con.end()
  }

  /**
   * drops the database
   * @param {string} database
   */
  async dropDatabase(database: string) {
    const con = await createConnection(noDatabaseConfig)
    // drop the database if it exists
    await Query.dropDatabase(con, database)
    await con.end()
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   * @param {string} database
   */
  async clearDatabase(database: string) {
    const con = await createConnection(noDatabaseConfig)
    // drop the database if it exists
    await Query.dropDatabase(con, database)
    await Query.createDatabase(con, database)
    await con.end()
  }
}

export const sql = new Sql(config.type)
