import { container, endpoint } from '../src/data-source'
import { remove } from '../src/sql'
import { setup } from './setup'

import { Module } from '../src/entity/Module'
import { ModuleRepository } from '../src/repository/Module'

beforeAll(async () => {
  await setup()
})

async function pull() {
  const res = await ModuleRepository.pull()
  return res
}

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  await remove.tables(['user_modules_completed_module', 'user_modules_doing_module', 'degree_modules_required_module', 'module'])
  const res = await endpoint(async () => await container(pull))
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
