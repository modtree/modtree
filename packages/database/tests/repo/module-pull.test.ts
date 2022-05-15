import { container, endpoint } from '../../src/data-source'
import { Module } from '../../src/entity-repo/Module'
import { ModuleRepository } from '../../src/repository/Module'
import { remove } from '../../src/sql'
import { setup } from '../setup'

beforeAll(async () => {
  await setup()
})

async function pull() {
  const res = await ModuleRepository.pull()
  return res
}

jest.setTimeout(60000)
test('pull all modules from NUSMods', async () => {
  await remove.tables(['degree_modules_required_module', 'module'])
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
