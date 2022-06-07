import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { Repo, setup, teardown } from '../environment'
import { oneUp } from '../../src/utils'

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
    Repo.Module
      .pull()
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        expect(res[0]).toBeInstanceOf(Module)
        expect(res.length).toBeGreaterThan(lowerBound)
      })
  )
})
