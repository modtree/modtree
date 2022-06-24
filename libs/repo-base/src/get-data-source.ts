import { DataSource } from 'typeorm'
import { db as defaultSource } from '@modtree/typeorm-config'

/**
 * ensures a fallback database
 *
 * @param {DataSource} db
 * @returns {DataSource}
 */
export function getDataSource(db?: DataSource): DataSource {
  return db || defaultSource
}
