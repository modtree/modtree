import { connectionConfig, deleteTable }  from '../../sql'
import { createConnection } from 'mysql'

const con = createConnection(connectionConfig)
deleteTable(con, 'moduleCondensed')
// deleteTable(con, 'module')
// deleteTable(con, 'user')
// deleteTable(con, 'moduleCheck')
con.end()
