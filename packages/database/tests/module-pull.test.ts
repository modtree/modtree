import { container, endpoint, getSource } from '../src/data-source'
import { sql } from '../src/sql'
import { Module } from '../src/entity'
import { ModuleRepository } from '../src/repository'
import { setup, teardown, importChecks } from './environment'

const dbName = 'test_module_pull'
const db = getSource(dbName)

importChecks({
  entities: [Module],
  repositories: [ModuleRepository(db)],
})

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  await sql.dropTables(dbName, [
    'dag_modules_placed_module',
    'dag_modules_hidden_module',
    'dag_modules_hidden_module',
    'user_modules_doing_module',
    'user_modules_done_module',
    'degree_modules_module',
    'module',
  ])
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).pull())
  )
  expect(res).toBeDefined()
  expect(res).not.toBeNull()
  if (!res) return
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(6100)
})
