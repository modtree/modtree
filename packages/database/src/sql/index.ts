import { DatabaseType } from 'typeorm'
import { config } from '../config'
import { Mysql } from './mysql'

const getSql = (type: DatabaseType) => {
  if (type === 'mysql') return new Mysql()
  if (type === 'postgres') return new Mysql()
  return new Mysql()
}

export const sql = getSql(config.type)
