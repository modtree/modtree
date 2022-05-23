import { DatabaseType } from 'typeorm'
import { config } from '../config'
import { Mysql } from './mysql'
import { Postgresql } from './postgres'

const getSql = (type: DatabaseType) => {
  if (type === 'mysql') return new Mysql()
  if (type === 'postgres') return new Postgresql()
  return new Mysql()
}

export const sql = getSql(config.type)
