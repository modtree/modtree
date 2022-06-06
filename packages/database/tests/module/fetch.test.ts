import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { getModuleRepository } from '../../src/repository'
import { oneUp } from '../../src/utils'
import { setup, teardown } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('fetch one module from NUSMods', async () => {
  const res = await container(db, () =>
    getModuleRepository(db).fetchOne('CS2040S')
  )
  expect(res).toBeInstanceOf(Module)
})
