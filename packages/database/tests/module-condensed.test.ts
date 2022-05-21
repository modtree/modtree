import { container, endpoint, getSource } from '../src/data-source'
import { ModuleCondensed } from '../src/entity'
import { ModuleCondensedRepository } from '../src/repository'
import { setup, importChecks, teardown } from './environment'

const dbName = 'test_module_condensed'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [ModuleCondensed],
  repositories: [ModuleCondensedRepository(db)],
})

const lowerBound = 6000

test('moduleCondensed.get', async () => {
  const moduleList = await endpoint(db, () =>
    container(db, () => ModuleCondensedRepository(db).find())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) return
  /* make sure every element is a valid ModuleCondensed */
  moduleList.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  /* make sure that all moduleCodes are unique */
  const s = new Set(moduleList.map((m) => m.moduleCode))
  expect(s.size).toBe(moduleList.length)
  expect(s.size).toBeGreaterThan(lowerBound)
})

test('moduleCondensed.getCodes', async () => {
  const moduleList = await endpoint(db, () =>
    container(db, () => ModuleCondensedRepository(db).getCodes())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) return
  expect(moduleList).toBeInstanceOf(Array)
  moduleList.forEach((moduleCode) => {
    expect(typeof moduleCode).toBe('string')
  })
  expect(moduleList.length).toBeGreaterThan(lowerBound)
})

test('moduleCondensed.fetch', async () => {
  const moduleList = await endpoint(db, () =>
    container(db, () => ModuleCondensedRepository(db).fetch())
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) return
  /* make sure every element is a valid ModuleCondensed */
  moduleList.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  const s = new Set(moduleList)
  expect(s.size).toBe(moduleList.length)
  expect(s.size).toBeGreaterThan(lowerBound)
})
