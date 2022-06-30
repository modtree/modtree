import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from '.'

/**
 * custom source creator
 *
 * @param {string} database to use
 * @returns {DataSource}
 */
export function getSource(database: string): DataSource {
  const dataSourceOptions = {
    ...config,
    database,
  }
  return new DataSource(dataSourceOptions)
}
