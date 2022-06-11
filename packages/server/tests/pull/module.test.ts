import { Module } from '@modtree/entity'
import { Repo, setup, teardown } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const lowerBound = 6100

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  expect.assertions(3)
  await container(db, () => Repo.Module.deleteAll())
  await container(db, () =>
    Repo.Module.pull().then((res) => {
      expect(res).toBeInstanceOf(Array)
      expect(res[0]).toBeInstanceOf(Module)
      expect(res.length).toBeGreaterThan(lowerBound)
    })
  )
})