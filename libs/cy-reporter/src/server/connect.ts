import { DataSource } from 'typeorm'
import chalk from 'chalk'

type Config = {
  maxRetries: number
  intervalInMilliseconds: number
  dataSource: DataSource
}

type RunServer = (_: DataSource) => Promise<void>

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const log = {
  attempt(n: number) {
    console.debug(`Connecting to database, attempt #${n}`)
  },
  end(db: DataSource) {
    const output = db.isInitialized
      ? chalk.green(`Successful connection to [${db.options.database}]`)
      : chalk.red('Failed to connect to database')
    console.debug(output, chalk.gray('Retry manager out.'))
  },
}

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
  console.debug('Initializing connection to database...')
  console.debug(dataSource.options)

  /** each attempt to connect to database */
  const attempt = () => dataSource.initialize().then(callback)

  /** load the stack */
  let count = 1
  let stack = attempt()
  for (let i = 0; i < maxRetries; i++) {
    stack = stack.catch(async () => {
      log.attempt(count)
      count += 1
      return sleep(intervalInMilliseconds).then(attempt)
    })
  }

  /** top off the stack with an end message */
  stack.finally(() => log.end(dataSource))
}
