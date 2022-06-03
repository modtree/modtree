import { container, getSource } from '../../src/data-source'
import { sql } from '../../src/sql'
import { Module } from '../../src/entity'
import { ModuleRepository } from '../../src/repository'
import { setup, teardown } from '../environment'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  await sql.dropTables(dbName, [
    'graph_modules_placed_module',
    'graph_modules_hidden_module',
    'user_modules_doing_module',
    'user_modules_done_module',
    'degree_modules_module',
    'module',
  ])
  const res = await 
  container(db, () => ModuleRepository(db).pull())
  expect(res).toBeDefined()
  expect(res).not.toBeNull()
  if (!res) return
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(6100)
})
