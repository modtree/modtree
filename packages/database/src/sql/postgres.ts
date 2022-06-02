import { config } from '../config'
import { join } from 'path'
import { exec } from '../shell'
import { BaseSql, promptDump, promptRestore } from './base'
import { Client } from 'pg'

const noDatabaseConfig = {
  host: config.host,
  user: config.username,
  password: config.password,
}

const connectionConfig = (database: string) => ({
  ...noDatabaseConfig,
  database,
})

/** Sql interface for POSTGRESQL */
export class Postgresql extends BaseSql {
  /** instantiate a new Sql class */
  constructor() {
    super('postgres')
  }

  /**
   * removes a single table from a postgres database
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
   * removes a list of tables from a postgres database
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
    await exec(`dropdb ${database}`).catch((err) => {
      console.log('Clear DB: Drop DB')
      console.log(err)
    })
    await exec(`createdb ${database}`).catch((err) => {
      console.log('Clear DB: Create DB')
      console.log(err)
    })
  }

  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  async restoreFromFile(database: string, filename: string) {
    await this.clearDatabase(database)
    const file = join(config.rootDir, '.sql', filename)
    const u = config.username ? `--username=${config.username}` : ''
    const p = config.password ? `PGPASSWORD=${config.password}` : ''
    const cmd = `${p} ${this.coreCmd} ${u} ${database} < ${file}`
    await exec(cmd).catch((err) => {
      console.log('Restore from file error')
      console.log(err)
    })
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

  /**
   * dump a database snapshot to an .sql file
   * @param {string} database
   */
  async dump(database: string) {
    const filename = await promptDump()
    const withExt = filename.concat('.sql')
    const file = join(config.rootDir, '.sql', withExt)
    const u = config.username ? `-u ${config.username}` : ''
    const p = config.password ? `-p\"${config.password}\"` : ''
    const cmd = `${this.dumpCmd} ${u} ${p} ${database} > ${file}`
    await exec(cmd)
  }
}
