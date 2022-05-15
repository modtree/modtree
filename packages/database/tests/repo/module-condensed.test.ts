import { AppDataSource, container, endpoint } from '../../src/data-source'
import { setup } from '../setup'
import { ModuleCondensed } from '../../src/entity-repo/ModuleCondensed'
import { ModuleCondensedRepository } from '../../src/repository/ModuleCondensed'
import { remove } from '../../src/sql'

const lowerBound = 6000

let total = 0

beforeAll(async () => {
  await setup()
})

test('moduleCondensed.get', async () => {
  const moduleList = await endpoint(
    async () => await container(() => ModuleCondensedRepository.find())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) {
    return
  }
  /* make sure every element is a valid ModuleCondensed */
  moduleList.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  /* make sure that all moduleCodes are unique */
  const s = new Set(moduleList.map((m) => m.moduleCode))
  expect(s.size).toBe(moduleList.length)
  expect(s.size).toBeGreaterThan(lowerBound)
  total = s.size
})

test('moduleCondensed.getCodes', async () => {
  const moduleList = await endpoint(
    async () => await container(() => ModuleCondensedRepository.getCodes())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) {
    return
  }
  expect(moduleList).toBeInstanceOf(Array)
  moduleList.forEach((moduleCode) => {
    expect(typeof moduleCode).toBe('string')
  })
  expect(moduleList.length).toBeGreaterThan(lowerBound)
  expect(moduleList.length).toStrictEqual(total)
})

test('moduleCondensed.fetch', async () => {
  const moduleList = await endpoint(
    async () => await container(() => ModuleCondensedRepository.fetch())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) {
    return
  }
  /* make sure every element is a valid ModuleCondensed */
  moduleList.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  const s = new Set(moduleList)
  expect(s.size).toBe(moduleList.length)
  expect(s.size).toBeGreaterThan(lowerBound)
  expect(s.size).toStrictEqual(total)
})

jest.setTimeout(10000)
test('moduleCondensed.pull', async () => {
  remove.tables(['moduleCondensed'])
  const pullOnEmpty = await container(() => ModuleCondensedRepository.pull())
  const pullOnFull = await container(() => ModuleCondensedRepository.pull())
  const written = await endpoint(
    async () => await container(() => ModuleCondensedRepository.find())
  )

  expect([pullOnFull, pullOnEmpty, written]).toBeDefined()
  if (!pullOnFull || !pullOnEmpty || !written) {
    return
  }
  /* make sure every element is a valid ModuleCondensed */
  written.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  const s = new Set(written)
  expect(s.size).toBe(written.length)
  expect(s.size).toBeGreaterThan(lowerBound)
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
  }
})
