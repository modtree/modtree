import { config } from '../config'
import { createConnection } from 'mysql2/promise'
import { join } from 'path'
import { exec } from '../shell'
import { BaseSql, promptDump, promptRestore } from './base'

const noDatabaseConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

/** Sql interface for MYSQL */
export class Mysql extends BaseSql {
  /** instantiate a new Sql class */
  constructor() {
    super('mysql')
  }

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  async dropTable(database: string, table: string) {
    const con = await createConnection(connectionConfig(database))
    await con.query(`DROP TABLE IF EXISTS ${table}`)
    await con.end()
  }

  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  async dropTables(database: string, tables: string[]) {
    const con = await createConnection(connectionConfig(database))
    await Promise.all(
      tables.map((table) => con.query(`DROP TABLE IF EXISTS ${table}`))
    )
    await con.end()
  }

  /**
   * drops the database
   * @param {string} database
   */
  async dropDatabase(database: string) {
    const con = await createConnection(noDatabaseConfig)
    // drop the database if it exists
    await con.query(`DROP DATABASE IF EXISTS ${database}`)
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
    await con.query(`DROP DATABASE IF EXISTS ${database}`)
    await con.query(`CREATE DATABASE ${database}`)
    await con.end()
  }

  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile(database: string, filename: string) {
    await this.clearDatabase(database)
    const file = join(config.rootDir, '.sql', filename)
    const u = config.username ? `-u ${config.username}` : ''
    const p = config.password ? `-p\"${config.password}\"` : ''
    const cmd = `mysql ${u} ${p} ${database} < ${file}`
    await exec(cmd)
  }

  /**
   * interactive prompt to guide the user to restore an SQL database
   * @param {string} database
   */
  restorePrompted(database: string) {
    promptRestore(database).then(async (answers) => {
      if (answers.confirm === 'no') {
        console.log('cancelled.')
        return
      }
      await this.restoreFromFile(database, answers.sql)
    })
  }

  async dump(database: string) {
    const filename = await promptDump()
    const withExt = filename.concat('.sql')
    const file = join(config.rootDir, '.sql', withExt)
    const u = config.username ? `-u ${config.username}` : ''
    const p = config.password ? `-p\"${config.password}\"` : ''
    const cmd = `${this.dumpCmd[this.type]} ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
}
