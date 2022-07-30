/**
 * this test acts as a script that makes all aliases into an array
 */

import { source } from '@modtree/typeorm-config'
import { Api } from '@modtree/repos'

jest.setTimeout(600000)
test.skip('end', async () => {
  const db = source.development
  const connect = db.initialize()

  const getApi = connect.then((db) => new Api(db))

  const main = getApi.then(async (api) => {
    const repos = [
      api.userRepo,
      api.moduleRepo,
      api.moduleFullRepo,
      api.moduleCondensedRepo,
      api.graphRepo,
      api.degreeRepo,
    ]
    const names = repos.map((r) => r.metadata.name)
    const zip = (a: any[], b: any[]) => a.map((a, i) => [a, b[i]])
    const counts = Promise.all(repos.map((r) => r.count()))
    return counts.then((counts) => {
      console.log(zip(names, counts))
    })
  })

  const end = main.finally(() => {
    return db.isInitialized ? db.destroy() : null
  })

  await end
  expect(1).toBe(1)
})
