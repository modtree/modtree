import { Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('there are modules', async () => {
  await Repo.Module!.count().then((count) => {
    expect(count).toBeGreaterThan(0)
  })
})

test('deletes all', async () => {
  await Repo.Module!.deleteAll()
    .then(() => Repo.Module!.count())
    .then((count) => {
      expect(count).toEqual(0)
    })
})
