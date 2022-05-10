import {  connectionConfig } from '../src/sql'
import { createConnection } from 'mysql2/promise'
import { log } from '../src/cli'
import { config } from '../src/config'

async function teardown() {
  log.yellow(`creating connection that requires ${config.database}`)
  const con = await createConnection(connectionConfig)
  await con.query(`DROP DATABASE ${config.database};`)
  await con.end()
  log.magenta('finished teardown')
}

function nulldown() {
  log.yellow('did nothing for teardown')
}

export default teardown
// export default nulldown
