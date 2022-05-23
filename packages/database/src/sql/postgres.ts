import { config } from '../config'
import { join } from 'path'
import { exec } from '../shell'
import input from '@inquirer/input'
import inquirer from 'inquirer'
import fs from 'fs'
import { BaseSql } from './base'
import { Client } from 'pg'
import { log } from '../cli'

const adminDb = 'modtree_admin'

const noDatabaseConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

export class Postgresql extends BaseSql {
  /** instantiate a new Sql class */
  constructor() {
    super('postgres')
  }

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  async dropTable(database: string, table: string) {
    const psql = new Client(connectionConfig(database))
    await psql.connect()
    await psql.query(`DROP TABLE IF EXISTS ${table}`)
    await psql.end()
  }

  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  async dropTables(database: string, tables: string[]) {
    const psql = new Client(connectionConfig(database))
    await psql.connect()
    await Promise.all(
      tables.map((table) => psql.query(`DROP TABLE IF EXISTS ${table}`))
    )
    await psql.end()
  }

  /**
   * drops the database
   * @param {string} database
   */
  async dropDatabase(database: string) {
    await exec(`dropdb ${database}`)
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   * @param {string} database
   */
  async clearDatabase(database: string) {
    // const psql = new Client(connectionConfig(adminDb))
    // await psql.connect()
    // console.log("CLEARING DATABASE...")
    // await psql.query(`DROP DATABASE \"${database}\";`)
    // await psql.query(`CREATE DATABASE \"${database}\";`).then(() => {
    //   log.green(`created database ${database}`)
    // }).catch(() => {log.red(`failed to create database ${database}`)})
    // await psql.end()
    await exec(`dropdb ${database}`)
    await exec(`createdb ${database}`)
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
    const cmd = `${this.coreCmd} ${u} ${p} ${database} < ${file}`
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
    const u = config.username ? `-u ${config.username}` : ''
    const p = config.password ? `-p\"${config.password}\"` : ''
    const cmd = `${this.dumpCmd} ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
}
