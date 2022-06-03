import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { ModuleRepository } from '../../src/repository'
import { oneUp } from '../../src/utils'
import { setup, teardown } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

test('fetch one module from NUSMods', async () => {
  const res = await container(db, () =>
    ModuleRepository(db).fetchOne('CS2040S')
  )
  expect(res).toBeInstanceOf(Module)
})