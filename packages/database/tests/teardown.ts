import { connectionConfig } from '../src/sql/config'
import { createConnection } from 'mysql2/promise'
import { log } from '../src/cli'
import { config } from '../src/config'

async function teardown() {
 await createConnection(connectionConfig)
    .then(async (connection) => {
      await connection
        .query(`DROP DATABASE ${config.database};`)
        .then()
        .catch(() => {
          console.log('ok')
        })
      await connection.end().then().catch()
      log.yellow('Teardown: completed')
    })
    .catch(() => {
      console.log('nothing to teardown')
    })
}

function nulldown() {
  log.yellow('did nothing for teardown')
}

nulldown.name
teardown.name

export default teardown
// export default nulldown
