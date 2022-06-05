import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { ModuleRepository } from '../../src/repository'
import { setup, teardown } from '../environment'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  expect.assertions(3)
  await container(db, () => ModuleRepository(db).deleteAll())
  await container(db, () =>
    ModuleRepository(db)
      .pull()
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        expect(res[0]).toBeInstanceOf(Module)
        expect(res.length).toBeGreaterThan(6100)
      })
  )
})
