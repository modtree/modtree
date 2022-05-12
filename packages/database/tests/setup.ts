import { initConfig } from '../src/sql'
import { config } from '../src/config'
import { createConnection } from 'mysql2/promise'
import { log } from '../src/cli'

export default async function setup() {
  const init =  await createConnection(initConfig)
  await init.query(`CREATE DATABASE ${config.database};`).then(() => {
    log.yellow('Setup: created test database')
  }).catch(() => {
    log.gray('Setup: test db already exists')
  })
  await init.end()

  // reset tables
  // log.yellow(`creating connection that requires ${config.database}`)
  // const con = await createConnection(connectionConfig)
  // await deleteTable2(con, 'moduleCondensed')
  // await deleteTable2(con, 'module')
  // await deleteTable2(con, 'user')
  // await deleteTable2(con, 'moduleCheck')
  // await con.end()
  // console.log('finished setup')
}
