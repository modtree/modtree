import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { ModtreeFunction } from '../types/modtree'
import { log } from './cli'
import { config } from './config'

/**
 * custom source creator
 * @param {string} database to use
 * @return {DataSource}
 */
export function getSource(database: string): DataSource {
  return new DataSource({
    ...config,
    database,
  })
}

/**
 * a wrapper for typeorm-based database connections
 * @param {DataSource} database
 * @param {ModtreeFunction} fn
 * @return {Promise<T | void>}
 */
export function container<T>(
  database: DataSource,
  fn: () => Promise<T | void>
): Promise<T | void> {
  // if already initialized, reattach to old instance
  if (database.isInitialized) return fn()
  // if not initialized, kickstart a new instance
  return (
    database
      .initialize()
      .then(fn)
      // failed to initialize database connection
      .catch((error) => {
        console.log(error)
        log.red('typeorm failed to initialize connection to database.')
      })
  )
}

/**
 * closes the connection to database after everything is done
 * meant to be an overall wrapper for all endpoint functions.
 * @param {DataSource} database
 * @param {ModtreeFunction<T>} callback
 * @return {Promise<T | void>}
 */
export function endpoint<T>(
  database: DataSource,
  callback: ModtreeFunction<T>
): Promise<T | void> {
  const response = callback()
    .catch((err) => {
      console.log('Endpoint error:', err)
    })
    .finally(async () => {
      // close database if still open
      if (database.isInitialized) await database.destroy()
    })
  return response
}
