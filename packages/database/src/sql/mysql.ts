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

class Sql {
  type: DatabaseType
  dumpCmd: Partial<Record<DatabaseType, string>> = {
    mysql: 'mysqldump',
    postgres: 'pg_dump',
  }
  coreCmd: Partial<Record<DatabaseType, string>> = {
    mysql: 'mysql',
    postgres: 'psql',
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
    const u = config.username == '' ? '' : `-u ${config.username}`
    const p = config.password == '' ? '' : `-p\"${config.password}\"`
    const cmd = `mysql ${u} ${p} ${database} < ${file}`
    await exec(cmd)
  }

  /** interactive prompt to guide the user to restore an SQL database */
  restorePrompted(database: string) {
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
          message: `Confirm overwrite database [${database}]?`,
          choices: ['yes', 'no'],
        },
      ])
      .then(async (answers: Answers) => {
        if (answers.confirm === 'no') {
          console.log('cancelled.')
          return
        }
        await this.restoreFromFile(database, answers.sql)
      })
  }

  async dump(database: string) {
    const filename = await input({
      message: 'Enter filename (without .sql):',
      default: 'backup',
    })
    const withExt = filename.concat('.sql')
    const file = join(config.rootDir, '.sql', withExt)
    const u = config.username == '' ? '' : `-u ${config.username}`
    const p = config.password == '' ? '' : `-p\"${config.password}\"`
    const cmd = `${this.dumpCmd[this.type]} ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
}

export const sql = new Sql(config.type)
