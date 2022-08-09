import type { DataSource } from 'typeorm'

/**
 * for debugging the data source used
 *
 * @param {DataSource} dataSource
 * @param {string} name
 * @param {boolean} verbose
 */
export function inspectDataSource(
  dataSource: DataSource,
  name: string,
  verbose: boolean = false
) {
  if (verbose) {
    console.log('Initializing connection to database...')
    console.log(dataSource.options)
  } else {
    const db = dataSource.options.database
    console.log(`${name}: init connection to [${db}]`)
  }
}
