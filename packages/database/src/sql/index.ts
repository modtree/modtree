import { DatabaseType } from 'typeorm'
import { BaseSqlInterface } from './base'

const coreCmdMap: Partial<Record<DatabaseType, string>> = {
  mysql: 'mysql',
  postgres: 'psql',
}

const dumpCmdMap: Partial<Record<DatabaseType, string>> = {
  mysql: 'mysqldump',
  postgres: 'pg_dump',
}

export class BaseSql implements BaseSqlInterface {
  type: DatabaseType
  coreCmd: string
  dumpCmd: string

  /** instantiate a new Sql class */
  constructor(type: DatabaseType) {
    this.type = type
    this.coreCmd = coreCmdMap[type]
    this.dumpCmd = dumpCmdMap[type]
  }

  /**
   * removes a single table from a mysql database
   */
  async dropTable() {
    console.log('Not implemented yet')
  }

  /**
   * removes a list of tables from a mysql database
   */
  async dropTables() {
    console.log('Not implemented yet')
  }

  /**
   * drops the database
   */
  async dropDatabase() {
    console.log('Not implemented yet')
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   * @param {string} database
   */
  async clearDatabase() {
    console.log('Not implemented yet')
  }

  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile() {
    console.log('Not implemented yet')
  }

  /** interactive prompt to guide the user to restore an SQL database */
  async restorePrompted() {
    console.log('Not implemented yet')
  }

  async dump() {
    console.log('Not implemented yet')
  }
}
