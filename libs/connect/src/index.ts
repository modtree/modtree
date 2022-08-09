import { red, green, gray } from 'chalk'
import type { Config, RunServer } from './types'
import { inspectDataSource } from './utils'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * database connection retry manager, essentially
 *
 * @param {Config} config - specify data source, retries, and interval
 * @param {RunServer} callback - executes upon successful connection
 */
export function connect(config: Config, callback: RunServer) {
  /** destructure config */
  const { dataSource, maxRetries, intervalInMilliseconds } = config

  /** debug */
  inspectDataSource(dataSource, config.name, false)

  /** each attempt to connect to database */
  const attempt = () =>
    dataSource
      .initialize()
      .then(callback)
      .catch((err) => console.log('Retry manager:', err))

  /** load the stack */
  let count = 1
  let stack = attempt()
  for (let i = 0; i < maxRetries; i++) {
    stack = stack.catch(async () => {
      console.log(`Connecting to database, attempt #${count}`)
      count += 1
      return sleep(intervalInMilliseconds).then(attempt)
    })
  }

  /** top off the stack with an end message */
  stack.finally(() => {
    const output = dataSource.isInitialized
      ? green(`Successful connection to [${dataSource.options.database}]`)
      : red('Failed to connect to database')
    console.log(output, gray('Retry manager out.'))
  })
}
