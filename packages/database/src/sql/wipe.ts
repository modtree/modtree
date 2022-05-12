import { createConnection } from 'mysql2/promise'
import { log } from '../cli'
import { initConfig } from './config'

export namespace wipe {
  /* a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   */
  export async function database(database: string) {
    await createConnection(initConfig).then(async (connection) => {
      // drop the database if it exists
      await connection
        .query(`DROP DATABASE ${database};`)
        .then()
        .catch(() => {
          log.gray(`database [${database}] already non-existent`)
        })
      // create the database again
      await connection
        .query(`CREATE DATABASE ${database};`)
        .then()
        .catch(() => {
          log.gray(`database [${database}] already exists`)
        })
      await connection.end()
    })
  }
}
