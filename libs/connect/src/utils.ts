import type { DataSource } from 'typeorm'

/**
 * for debugging the data source used
 *
 * @param {DataSource} dataSource
 * @param {boolean} verbose
 */
export function inspectDataSource(
  dataSource: DataSource,
  verbose: boolean = false
) {
  if (verbose) {
    console.log('Initializing connection to database...')
    console.log(dataSource.options)
  } else {
    const db = dataSource.options.database
    console.log(`cy-reporter: init connection to [${db}]`)
  }
}
