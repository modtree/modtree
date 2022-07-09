/**
 * runs a test connection to a data source and checks its basic status
 */

import { migrationSource } from './migration.config'
import { Api } from '@modtree/repos'
import { Repository } from 'typeorm'

migrationSource
  .initialize()
  .then((db) => {
    const api = new Api(db)
    const repos: Repository<any>[] = [
      api.moduleRepo,
      api.moduleCondensedRepo,
      api.moduleFullRepo,
      api.userRepo,
      api.degreeRepo,
      api.graphRepo,
    ]
    const findOne = async <T>(repo: Repository<T>) => repo.find({ take: 1 })
    const countAndPrint = async <T>(repo: Repository<T>) =>
      repo.count().then((count) => {
        console.log(repo.metadata.name, 'has', count, 'entries')
      })

    /**
     * the find call will retrieve one real entry
     * this help detect and throw an error if there's any changes to schema
     */
    const findAndCount = repos.map((repo) =>
      findOne(repo)
        .then(() => countAndPrint(repo))
        .catch(() => console.log('error on', repo.metadata.name))
    )
    return Promise.allSettled(findAndCount)
  })
  .then(() => console.log('all settled'))
  .catch(() => console.log('not all settled'))
  .finally(() =>
    migrationSource.destroy().then(() => console.log('test-connect ended.'))
  )
