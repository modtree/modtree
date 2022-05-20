import { container, endpoint, getSource } from '../src/data-source'
import { remove } from '../src/sql'
import { setup, teardown } from './environment'
import { Module } from '../src/entity'
import { ModuleRepository } from '../src/repository'

const dbName = 'test_module_pull'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

async function pull() {
  const res = await ModuleRepository(db).pull()
  return res
}

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  await remove.tables([
    'degree_modules_module',
    'user_modules_done_module',
    'user_modules_doing_module',
    'degree_modules_required_module',
    'module',
  ])
  const res = await endpoint(db, async () => await container(db, pull))
  expect(res).toBeDefined()
  expect(res).not.toBeNull()
  if (!res) {
    return
  }
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(6100)
})
