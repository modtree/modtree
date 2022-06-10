import { DatabaseType } from 'typeorm'
import { config } from '@modtree/typeorm-config'
import { Postgresql } from './postgres'

const getSql = (type: DatabaseType) => {
  if (type === 'postgres') return new Postgresql()
  /**
   * default to Postgresql
   */
  return new Postgresql()
}

export const sql = getSql(config.type)
