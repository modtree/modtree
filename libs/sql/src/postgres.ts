import { basename, join } from 'path'
import { Client } from 'pg'
import { config } from '@modtree/typeorm-config'
import { exec } from '@modtree/utils'
import { BaseSql, promptRestore } from './base'
import { ShellResponse } from '@modtree/types'
import { DataSourceOptions } from '@modtree/types'

/* eslint no-useless-escape: 0 */
// some piped shell commands below require seemingly useless escapes

const noDatabaseConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

const getSqlCommand = (config: DataSourceOptions, cmd: string, end: string) => {
  const username = config.username ? `--username=${config.username}` : ''
  const password = config.password ? `PGPASSWORD=${config.password}` : ''
  const host = config.host ? `--host=${config.host}` : ''
  const port = config.port ? `--port=${config.port}` : ''
  return [password, cmd, username, port, host, end].join(' ')
}

/** Sql interface for POSTGRESQL */
export class Postgresql extends BaseSql {
  clientGenerator: (database: string) => Client

  dropCmd = 'dropdb'

  createCmd = 'createdb'

  /** instantiate a new Sql class */
  constructor() {
    super('postgres')
    this.clientGenerator = (database: string) =>
      new Client(connectionConfig(database))
  }

  /**
   * removes a single table from a postgres database
   *
   * @param {string} database
   * @param {string} table
   */
  override async dropTable(database: string, table: string) {
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
  override async dropTables(database: string, tables: string[]) {
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
  override async dropDatabase(database: string): Promise<ShellResponse> {
    const command = getSqlCommand(config, this.dropCmd, database)
    return exec(command)
  }

  /**
   * creates a database
   *
   * @param {string} database
   */
  async createDatabase(database: string): Promise<ShellResponse> {
    const command = getSqlCommand(config, this.createCmd, database)
    return exec(command)
  }

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   *
   * @param {string} database
   */
  override async clearDatabase(database: string) {
    await exec(`${this.dropCmd} ${database}`)
    await exec(`${this.createCmd} ${database}`)
  }

  /**
   * restores SQL database from a file
   *
   * @param {string} database
   * @param {string} filename
   */
  override async restoreFromFile(database: string, filename: string) {
    await this.clearDatabase(database)
    const sourceFile = join(__dirname, '..', 'snapshots', basename(filename))
    const u = config.username ? `--username=${config.username}` : ''
    const p = config.password ? `PGPASSWORD=${config.password}` : ''
    const h = config.host ? `--host=${config.host}` : ''
    const cmd = `${p} ${this.coreCmd} ${u} ${h} ${database} < ${sourceFile}`
    await exec(cmd)
  }

  /**
   * interactive prompt to guide the user to restore an SQL database
   *
   * @param {string} database
   */
  override restorePrompted(database: string) {
    promptRestore(database).then(async (answers) => {
      if (answers.confirm === 'no') return
      await this.restoreFromFile(database, answers.sql)
    })
  }

  /**
   * dump a database snapshot to an .sql file
   *
   * @param {string} database
   */
  override async dump(database: string) {
    const filename = 'default-dump'
    const withExt = filename.concat('.sql')
    const file = join(config.rootDir, '.sql', withExt)
    const u = config.username ? `-u ${config.username}` : ''
    const p = config.password ? `-p\"${config.password}\"` : ''
    const cmd = `${this.dumpCmd} ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
}
