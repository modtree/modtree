import { db as DefaultSource } from '../../config'
import { DataSource } from 'typeorm'

/**
 * ensures a fallback database
 * @param {DataSource} db
 * @return {DataSource}
 */
export function getDataSource(db: DataSource): DataSource {
  return db || DefaultSource
}

