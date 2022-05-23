import { DatabaseType } from 'typeorm'

export interface BaseSqlInterface {
  type: DatabaseType
  coreCmd: string
  dumpCmd: string

  /**
   * removes a single table from a mysql database
   * @param {string} database
   * @param {string} table
   */
  dropTable(database: string, table: string): Promise<void>

  /**
   * removes a list of tables from a mysql database
   * @param {string} database
   * @param {string[]} tables
   */
  dropTables(database: string, tables: string[]): Promise<void>

  /**
   * drops the database
   * @param {string} database
   */
  dropDatabase(database: string): Promise<void>

  /**
   * a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   * @param {string} database
   */
  clearDatabase(database: string): Promise<void>

  /**
   * restores SQL database from a file
   * @param {string} database
   * @param {string} filename
   */
  restoreFromFile(database: string, filename: string): Promise<void>

  /**
   * interactive prompt to guide the user to restore an SQL database
   * @param {string} database
   */
  restorePrompted(database: string): void


  /**
   * dumps a database snapshot to a .sql file
   * @param {database}
   */
  dump(database: string): Promise<void>
}
