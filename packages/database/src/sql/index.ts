import { config } from '../config'
import { createConnection, Connection } from 'mysql2/promise'
import { DatabaseType } from 'typeorm'
import { join } from 'path'
import { exec } from '../shell'
import input from '@inquirer/input'
import inquirer from 'inquirer'
import fs from 'fs'

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
    await con.query(`DROP DATABASE IF EXISTS ${database}`)
  }
  static async createDatabase(con: Connection, database: string) {
    await con.query(`CREATE DATABASE ${database}`)
  }
  static async restoreDatabase(database: string, filename: string) {
    const file = join(config.rootDir, '.sql', filename)
    const u = config.username == '' ? '' : `-u ${config.username}`
    const p = config.password == '' ? '' : `-p\"${config.password}\"`
    const cmd = `mysqldump ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
  static async dumpDatabase(database: string, filename: string) {
    const withExt = filename.concat('.sql')
    const file = join(config.rootDir, '.sql', withExt)
    const u = config.username == '' ? '' : `-u ${config.username}`
    const p = config.password == '' ? '' : `-p\"${config.password}\"`
    const cmd = `mysqldump ${u} ${p} ${database} > ${file}`
    await exec(cmd)
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

  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile(database: string, filename: string) {
    await this.clearDatabase(database)
    const file = join(config.rootDir, '.sql', filename)
    const u = config.username == '' ? '' : `-u ${config.username}`
    const p = config.password == '' ? '' : `-p\"${config.password}\"`
    const cmd = `mysql ${u} ${p} ${database} < ${file}`
    await exec(cmd)
  }

  /** interactive prompt to guide the user to restore an SQL database */
  restorePrompted() {
    type Answers = {
      sql: string
      confirm: 'yes' | 'no'
    }
    const sqlDir = join(config.rootDir, '.sql')
    const sqlList = fs.readdirSync(sqlDir).filter((x) => x.endsWith('.sql'))
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'sql',
          message: 'Restore from .sql file?',
          choices: sqlList,
        },
        {
          type: 'list',
          name: 'confirm',
          message: `Confirm overwrite database [${config.database}]?`,
          choices: ['yes', 'no'],
        },
      ])
      .then(async (answers: Answers) => {
        if (answers.confirm === 'no') {
          console.log('cancelled.')
          return
        }
        await sql.clearDatabase(config.database)
        const filename = join(sqlDir, answers.sql)
        await Query.restoreDatabase(config.database, filename)
      })
  }

  async dump(database: string) {
    const filename = await input({
      message: 'Enter filename (without .sql):',
      default: 'backup',
    })
    await Query.dumpDatabase(database, filename)
  }
}

export const sql = new Sql(config.type)
