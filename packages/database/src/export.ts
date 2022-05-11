import { config } from './config'
// import mysqldump from 'mysqldump'
import { createConnection } from 'mysql2/promise'
import { connectionConfig, dumpSql } from './sql'
import path from 'path'
import { exec } from 'child_process'

// mysqldump({
//   connection: {
//     host: config.host,
//     user: config.username,
//     password: config.password,
//     database: config.database,
//   },
//   dumpToFile: './export.sql',
// })

// const overwrite = async (props: { sql: string }) => {
//   console.log('got here')
//   const projectRoot = process.cwd()
//   const sqlDir = path.join(projectRoot, '.sql')
//   const fullPath = path.join(sqlDir, props.sql)
//   const con = await createConnection(connectionConfig)
//   console.log('GOT HERE')
//   await dumpSql(con, fullPath)
//   await con.end()
// }
//
// overwrite({
//   sql: 'output.sql',
// })
//
