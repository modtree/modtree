import { initConfig, deleteTable2, connectionConfig } from '../src/sql'
import { config } from '../src/config'
import { createConnection } from 'mysql2/promise'
import { log } from '../src/cli'

export default async function setup() {
  const init =  await createConnection(initConfig)
  await init.query(`CREATE DATABASE ${config.database};`).then(() => {
    log.magenta('Created test database')
  }).catch(() => {
    log.magenta('Failed or exists')
  })
  await init.end()

  // reset tables
  log.yellow('creating connection that requires mtt')
  const con = await createConnection(connectionConfig)
  await deleteTable2(con, 'moduleCondensed')
  await deleteTable2(con, 'module')
  await deleteTable2(con, 'user')
  await deleteTable2(con, 'moduleCheck')
  await con.end()
  console.log('finished setup')
}
