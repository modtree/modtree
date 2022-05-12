import { config } from '../config'
import { createConnection } from 'mysql2/promise'
import { log } from '../cli'
import { restore } from './restore'
import { initConfig } from './config'

export namespace wipe {
  /* a very aggressive function that drops the database
   * and then recreates it for a completely fresh start
   * so ensure .env.test has the corrent database name.
   */
  export async function database() {
    const init = await createConnection(initConfig)
    // drop the database if it exists
    await init
      .query(`DROP DATABASE ${config.database};`)
      .then()
      .catch(() => {
        console.log('calm down and carry on')
      })
    // create the database again
    await init
      .query(`CREATE DATABASE ${config.database};`)
      .then(() => {
        log.yellow('Setup: created test database')
      })
      .catch(() => {
        log.gray('Setup: test db already exists')
      })
    // restore the database state from /.sql/test-source.sql
    await restore.file('test-source.sql')
    await init.end()
  }
}
