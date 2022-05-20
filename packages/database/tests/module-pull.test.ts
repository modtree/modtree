import { container, endpoint } from '../src/data-source'
import { remove } from '../src/sql'
import { setup } from './setup'
import { Module } from '../src/entity'
import { ModuleRepository } from '../src/repository'
import { db } from '../src/config'

beforeAll(setup)

async function pull() {
  const res = await ModuleRepository.pull()
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
