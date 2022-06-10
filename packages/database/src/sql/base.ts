import { DatabaseType } from 'typeorm'
import inquirer from 'inquirer'
import { join } from 'path'
import fs from 'fs'
import input from '@inquirer/input'
import { config } from '@modtree/typeorm-config'
import { BaseSqlInterface } from './types'

const coreCmdMap: Partial<Record<DatabaseType, string>> = {
  mysql: 'mysql',
  postgres: 'psql',
}

const dumpCmdMap: Partial<Record<DatabaseType, string>> = {
  mysql: 'mysqldump',
  postgres: 'pg_dump',
}

export const promptDump = () =>
  input({
    message: 'Enter filename (without .sql):',
    default: 'backup',
  })

type Answers = {
  sql: string
  confirm: 'yes' | 'no'
}

export const promptRestore = async (database: string): Promise<Answers> =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'sql',
      message: 'Restore from .sql file?',
      choices: fs
        .readdirSync(join(config.rootDir, '.sql'))
        .filter((x) => x.endsWith('.sql')),
    },
    {
      type: 'list',
      name: 'confirm',
      message: `Confirm overwrite database [${database}]?`,
      choices: ['yes', 'no'],
    },
  ])

/** base class of SQL interface */
export class BaseSql implements BaseSqlInterface {
  type: DatabaseType

  coreCmd: string

  dumpCmd: string

  /**
   * instantiate a new Sql class
   *
   * @param {DatabaseType} type
   */
  constructor(type: DatabaseType) {
    this.type = type
    this.coreCmd = coreCmdMap[type]
    this.dumpCmd = dumpCmdMap[type]
  }

  /**
   * removes a single table from a mysql database
   *
   * @param {string} database
   * @param {string} table
   */
  async dropTable(database: string, table: string) {
    throw new Error(
      `${this.type}: not implemented yet for ${database}, ${table}`
    )
  }

  /**
   * removes a list of tables from a mysql database
   *
   * @param {string} database
   * @param {string[]} tables
   */
  async dropTables(database: string, tables: string[]) {
    throw new Error(
      `${this.type}: not implemented yet for ${database}, ${tables}`
    )
  }

  /**
   * drops the database
   *
   * @param {string} database
   */
  async dropDatabase(database: string) {
    throw new Error(`${this.type}: not implemented yet for ${database}`)
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   *
   * @param {string} database
   */
  async clearDatabase(database: string) {
    throw new Error(`${this.type}: not implemented yet for ${database}`)
  }

  /**
   * restores SQL database from a file
   *
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile(database: string, filename: string) {
    throw new Error(
      `${this.type}: not implemented yet for ${database}, ${filename}`
    )
  }

  /**
   * interactive prompt to guide the user to restore an SQL database
   *
   * @param {string} database
   */
  restorePrompted(database: string) {
    throw new Error(`${this.type}: not implemented yet for ${database}`)
  }

  /**
   * dump a database snapshot to an .sql file
   *
   * @param {string} database
   */
  async dump(database: string) {
    throw new Error(`${this.type}: not implemented yet for ${database}`)
  }
}
