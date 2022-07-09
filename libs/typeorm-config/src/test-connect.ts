/**
 * runs a test connection to a data source and checks its basic status
 */

import 'dotenv/config'
import { migrationSource } from './migration.config'
import { Api } from '@modtree/repos'
import { QueryFailedError, Repository } from 'typeorm'
import chalk from 'chalk'

const log = console.debug
log(chalk.gray('Starting test-connect...'))

// quick message
const q = {
  // then
  t:
    (message: string) =>
    <T>(e: T) => {
      console.debug(chalk.green(' ✓ ' + message))
      return e
    },
  // catch
  c:
    (message: string) =>
    <T>(e: T) => {
      console.debug(chalk.red(' ✗ ' + message))
      log(e)
      return e
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
const getRepos: Promise<Repository<any>[]> = connect
  .then((db) => {
    const api = new Api(db)
    return [
      api.moduleRepo,
      api.moduleCondensedRepo,
      api.moduleFullRepo,
      api.userRepo,
      api.degreeRepo,
      api.graphRepo,
    ]
  })
  .then(q.t('instantiate repos'))
  .catch(q.c('cannot instantiate repos'))

const getNames = getRepos.then((repos) => repos.map((r) => r.metadata.name))

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

const zip = Promise.all([getNames, check]).then(([names, outcomes]) =>
  names.map((n, i) => ({ name: n, outcome: outcomes[i] }))
)

const analyzeError = (repo: string, err: any) => {
  if (err instanceof QueryFailedError) {
    log(chalk.yellow(' * Repository:', repo))
    log(chalk.red(' *', err.message))
  }
}

const analyze = zip.then((results) => {
  results.forEach((res) => {
    if (res.outcome.status === 'rejected') {
      analyzeError(res.name, res.outcome.reason)
    } else {
      log(chalk.green(' ✓ Repository:', res.name, 'is ok'))
    }
  })
})

analyze
  .finally(() =>
    migrationSource
      .destroy()
      .then(q.t('test connection destroyed'))
      .catch(q.c('test connection left hanging'))
  )
  .finally(() => log(chalk.gray('Test-connect has ended.')))
