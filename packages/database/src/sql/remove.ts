import { connectionConfig } from '.'
import { createConnection, Connection } from 'mysql2/promise'

const removeTable = async (con: Connection, table: string) => {
  const sql = `DROP TABLE IF EXISTS ${table}`
  await con.query(sql).then(() => {
    console.log(`[${table}] table deleted.`)
  })
}

export async function remove(tables: string[]) {
  const con = await createConnection(connectionConfig)
  const q = []
  tables.forEach((table) => {
    q.push(removeTable(con, table))
  })
  await Promise.all(q)
  await con.end()
  console.log('finished setup')
}
