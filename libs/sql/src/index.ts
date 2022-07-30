import { join } from 'path'
import { Client } from 'pg'
import { config } from '@modtree/typeorm-config'
import { exec } from '@modtree/utils'
import { ShellResponse } from '@modtree/types'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

/**
 * this file is mostly used in test environments
 */

/* eslint no-useless-escape: 0 */
// some piped shell commands below require seemingly useless escapes

const noDatabaseConfig = {
  host: config.test.host,
  user: config.test.username,
  password: config.test.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

const getSqlCommand = (
  config: PostgresConnectionOptions,
  cmd: string,
  args: string[]
) => {
  const username = config.username ? `--username=${config.username}` : ''
  const password = config.password ? `PGPASSWORD=${config.password}` : ''
  const host = config.host ? `--host=${config.host}` : ''
  const port = config.port ? `--port=${config.port}` : ''
  const final = [password, cmd, username, port, host, ...args].join(' ')
  return final
}

/** Sql interface for POSTGRESQL */
class Sql {
  clientGenerator: (database: string) => Client
  private dropCmd = 'dropdb'
  private createCmd = 'createdb'

  /** instantiate a new Sql class */
  constructor() {
    this.clientGenerator = (database: string) =>
      new Client(connectionConfig(database))
  }

  /**
   * removes a single table from a postgres database
   *
   * @param {string} database
   * @param {string} table
   */
  async dropTable(database: string, table: string) {
    const psql = this.clientGenerator(database)
    await psql.connect()
    await psql.query(`DROP TABLE IF EXISTS ${table}`)
    await psql.end()
  }

  /**
   * removes a list of tables from a postgres database
   *
   * @param {string} database
   * @param {string[]} tables
   */
  async dropTables(database: string, tables: string[]) {
    const psql = this.clientGenerator(database)
    await psql.connect()
    await Promise.all(
      tables.map((table) => psql.query(`DROP TABLE IF EXISTS ${table}`))
    )
    await psql.end()
  }

  /**
   * drops the database
   *
   * @param {string} database
   */
  async dropDatabase(database: string): Promise<ShellResponse> {
    const command = getSqlCommand(config.test, this.dropCmd, [database])
    return exec(command)
  }

  /**
   * creates a database
   *
   * @param {string} database
   */
  async createDatabase(database: string): Promise<ShellResponse> {
    const command = getSqlCommand(config.test, this.createCmd, [database])
    return exec(command)
  }

  /**
   * checks if database exists
   *
   * @param {string} database
   */
  async hasDatabase(database: string): Promise<Boolean> {
    const command = getSqlCommand(config.test, 'psql', ['-lqt', database])
    return exec(command).then((res) => res.stdout.includes(database))
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   *
   * @param {string} database
   */
  async clearDatabase(database: string) {
    await this.dropDatabase(database)
    await this.createDatabase(database)
  }

  /**
   * restores SQL database from a file
   *
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile(database: string, filename: string) {
    await this.clearDatabase(database)
    const sourceFile = join(__dirname, '..', 'snapshots', filename)
    const command = getSqlCommand(config.test, 'psql', [
      database,
      '<',
      sourceFile,
    ])
    await exec(command)
  }
}

export const sql = new Sql()
