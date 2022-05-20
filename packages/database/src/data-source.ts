import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { ModtreeFunction } from '../types/modtree'
import { log } from './cli'
import { config, db } from './config'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: config.entities,
  migrations: config.migrations,
  subscribers: [],
})

/**
 * custom source creator
 * @param {string} database to use
 * @return {DataSource}
 */
export function getSource(database: string): DataSource {
  return new DataSource({
    database,
    type: 'mysql',
    host: config.host,
    port: 3306,
    username: config.username,
    password: config.password,
    synchronize: true,
    logging: false,
    entities: config.entities,
    migrations: config.migrations,
    subscribers: [],
  })
}

/**
 * a wrapper for typeorm-based database connections
 * @param {ModtreeFunction} fn
 * @param {string} database
 * @return {Promise<T | void>}
 */
export async function container<T>(
  database: DataSource,
  fn: () => Promise<T | void>
): Promise<T | void> {
  // if already initialized, reattach to old instance
  if (database.isInitialized) {
    const res = await fn()
    return res
  }
  // if not initialized, kickstart a new instance
  const res = await database.initialize()
    .then(async () => {
      /** successfully initialize database connection */
      const res = await fn()
      return res
    })
    /** failed to initialize database connection */
    .catch((error) => {
      console.log(error)
      log.red('typeorm failed to initialize connection to database.')
    })
  return res
}

/**
 * closes the connection to database after everything is done
 * meant to be an overall wrapper for all endpoint functions.
 * @param {ModtreeFunction<T>} callback
 */
export async function endpoint<T>(
  database: DataSource,
  callback: ModtreeFunction<T>
): Promise<T | void> {
  const response = await callback()
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.log('Endpoint error:', err)
    })
  // close database if still open
  if (db.isInitialized) {
    await db.destroy()
  }
  return response
}

// /**
//  * same as endpoint but with arguments
//  * @param {ModtreeFunctionWithArgs<A, T>} callback
//  * @param {A} args
//  * @return {Promise<T | void>}
//  */
// export async function endpointWithArgs<A, T>(
//   callback: ModtreeFunctionWithArgs<A, T>,
//   args: A
// ): Promise<T | void> {
//   const response = await callback(args)
//     .then((res) => {
//       return res
//     })
//     .catch((err) => {
//       console.log('Endpoint error:', err)
//     })
//   // close database if still open
//   if (AppDataSource.isInitialized) {
//     await AppDataSource.destroy()
//   }
//   return response
// }
