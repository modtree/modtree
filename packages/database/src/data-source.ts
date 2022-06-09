import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { AsyncFunction } from '@modtree/types'
import { config } from './config'
import { log } from './cli'

/**
 * custom source creator
 *
 * @param {string} database to use
 * @returns {DataSource}
 */
export function getSource(database: string): DataSource {
  return new DataSource({
    ...config,
    database,
  })
}

/**
 * a wrapper for typeorm-based database connections
 *
 * @param {DataSource} database
 * @param {AsyncFunction} fn
 * @returns {Promise<T | void>}
 */
export function container<T>(
  database: DataSource,
  fn: () => Promise<T | void>
): Promise<T | void> {
  // if already initialized, reattach to old instance
  if (database.isInitialized) return fn()
  // if not initialized, kickstart a new instance
  return database.initialize().then(fn)
}

/**
 * closes the connection to database after everything is done
 * meant to be an overall wrapper for all endpoint functions.
 *
 * @param {DataSource} database
 * @param {AsyncFunction<T>} callback
 * @returns {Promise<T | void>}
 */
export function endpoint<T>(
  database: DataSource,
  callback: AsyncFunction<T>
): Promise<T | void> {
  const response = callback()
    .catch((err) => {
      log.yellow('Endpoint error:', err)
    })
    .finally(async () => {
      // close database if still open
      if (database.isInitialized) await database.destroy()
    })
  return response
}
