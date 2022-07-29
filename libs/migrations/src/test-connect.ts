/**
 * runs a test connection to a data source and checks its basic status
 */

import 'dotenv/config'
import { migrationSource } from './config'
import { EntityTarget, QueryFailedError, Repository } from 'typeorm'
import chalk from 'chalk'

const log = console.debug
log(chalk.gray('Starting test-connect...'))

// quick message
const q = {
  // then
  t:
    <T>(message: string) =>
    (e: T) => {
      log(chalk.green(' ✓ ' + message))
      return e
    },
  // catch
  c: (message: string) => () => {
    log(chalk.red(' ✗ ' + message))
    throw new Error(message)
  },
}

/**
 * initialize connection to database
 */
const connect = migrationSource
  .initialize()
  .then(q.t('initialize connection'))
  .catch(q.c('cannot initialize connection'))

/**
 * instantiate API, and get repositories as an array
 */
const entities = migrationSource.options.entities as EntityTarget<any>[]
const getRepos: Promise<Repository<any>[]> = connect
  .then((db) => {
    return entities.map((e) => new Repository(e, db.manager))
  })
  .then(q.t('instantiate repos'))
  .catch(q.c('cannot instantiate repos'))

/**
 * gather the names
 */
const getNames = getRepos.then((repos) => repos.map((r) => r.metadata.name))

/**
 * run the checks (no output logged here just yet)
 */
const check = getRepos.then((repos) =>
  Promise.allSettled(
    /**
     * retrieve one entity, and print the count
     *
     * retrieving one entity forces TypeORM to
     * detect if there's any change in schema
     */
    repos.map((r) => r.find({ take: 1 }).then(() => r.count()))
  )
)

/**
 * match names to their check results for easier analysis
 */
const zip = Promise.all([getNames, check]).then(([names, outcomes]) =>
  names.map((n, i) => ({ name: n, outcome: outcomes[i] }))
)

/**
 * This analyzes the error thrown, and is a possible place to inject
 * custom error handling in the future
 *
 * @param {string} repo - name of the Repository
 * @param {any} err - whatever error was thrown from the check
 */
const analyzeError = (repo: string, err: any) => {
  /**
   * QueryFailedError is our first known error.
   * One cause of this is a change in schema.
   */
  if (err instanceof QueryFailedError) {
    log(chalk.yellow(' * Repository:', repo))
    log(chalk.red(' *', `${err.name}`, err.message))
    // QueryFailedError-specific error handling
    return
  }
  if (err instanceof Error) {
    log(chalk.yellow(' * Repository:', repo))
    log(chalk.red(' *', `${err.name}`, err.message))
    // general error handling
    return
  }
  /**
   * still show unknown erros anyway
   */
  log(chalk.yellow(' * Repository:', repo))
  log(chalk.red(' *', err))
}

/**
 * analyze each repository's outcome only if the Promise resolved
 * as 'rejected'
 */
const analyze = zip.then((results) =>
  results.forEach((res) => {
    if (res.outcome.status === 'rejected') {
      analyzeError(res.name, res.outcome.reason)
    } else {
      log(chalk.green(' ✓ Repository:', res.name, 'is ok'))
    }
  })
)

/**
 * shut down the database connection
 */
const destroy = analyze.finally(() =>
  migrationSource
    .destroy()
    .then(q.t('test connection destroyed'))
    .catch(q.c('test connection left hanging'))
)

/**
 * end of script
 */
destroy.finally(() => log(chalk.gray('Test-connect has ended.')))
