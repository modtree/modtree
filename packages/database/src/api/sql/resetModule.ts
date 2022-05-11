import { connectionConfig, deleteTable }  from '../../sql'
import { createConnection } from 'mysql'

const con = createConnection(connectionConfig)
deleteTable(con, 'module')
con.end()
