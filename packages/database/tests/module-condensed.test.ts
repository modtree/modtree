import { endpoint } from '../src/data-source'
import { setup } from './setup'
import { ModuleCondensed } from '../src/entity'
import { remove } from '../src/sql'

const lowerBound = 6000

let total = 0

beforeAll(async () => {
  await setup()
})

/* ===================================================================
 *   MODULE CONDENSED
 * ===================================================================
 */

test('moduleCondensed.get', async () => {
  const moduleList = await endpoint(ModuleCondensed.get)
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
  const moduleList = await endpoint(ModuleCondensed.getCodes)
  expect(moduleList).toBeDefined()
  expect(moduleList).toBeInstanceOf(Set)
  if (!moduleList) {
    return
  }
  expect(moduleList.size).toBeGreaterThan(lowerBound)
  expect(moduleList.size).toStrictEqual(total)
})

test('moduleCondensed.fetch', async () => {
  const moduleList = await endpoint(ModuleCondensed.fetch)
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
  const pullOnEmpty = await endpoint(ModuleCondensed.pull)
  const pullOnFull = await endpoint(ModuleCondensed.pull)
  const written = await endpoint(ModuleCondensed.get)

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
  expect(s.size).toStrictEqual(total)
})
