import { DatabaseType } from 'typeorm'
import { config } from '@modtree/typeorm-config'
// import { Mysql } from './mysql'
import { Postgresql } from './postgres'

const getSql = (type: DatabaseType) => {
  // if (type === 'mysql') return new Mysql()
  if (type === 'postgres') return new Postgresql()
  return new Postgresql()
}

export const sql = getSql(config.type)
