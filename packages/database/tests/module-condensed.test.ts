import { container, endpoint } from '../src/data-source'
import { ModuleCondensed } from '../src/entity'
import { ModuleCondensedRepository } from '../src/repository'
import { setup, importChecks } from './setup'
import { db } from '../src/config'

importChecks({
  entities: [ModuleCondensed],
  repositories: [ModuleCondensedRepository(db)]
})

const lowerBound = 6000

let total = 0

beforeAll(setup)

test('moduleCondensed.get', async () => {
  const moduleList = await endpoint(db, () =>
    container(db,() => ModuleCondensedRepository(db).find())
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
  const moduleList = await endpoint(db, () =>
    container(db,() => ModuleCondensedRepository(db).getCodes())
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
  const moduleList = await endpoint(db, () =>
    container(db,() => ModuleCondensedRepository(db).fetch())
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
