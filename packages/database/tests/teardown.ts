import { connectionConfig } from '../src/sql/config'
import { createConnection } from 'mysql2/promise'
import { log } from '../src/cli'
import { config } from '../src/config'

/**
 * post-test tear down
 */
async function teardown() {
 await createConnection(connectionConfig)
    .then(async (connection) => {
      await connection.query(`DROP DATABASE ${config.database};`)
      await connection.end()
      log.yellow('Teardown: completed')
    })
    .catch(() => {
      console.log('nothing to teardown')
    })
}

// for debugging
function nulldown() {
  log.yellow('did nothing for teardown')
}

// to keep lsp happy when I'm not using one of them
nulldown.name
teardown.name

export default teardown
// export default nulldown
