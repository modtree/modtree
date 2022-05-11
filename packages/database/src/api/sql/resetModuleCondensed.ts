import { connectionConfig, deleteTable }  from '../../sql'
import { createConnection } from 'mysql'

const con = createConnection(connectionConfig)
deleteTable(con, 'moduleCondensed')
con.end()
