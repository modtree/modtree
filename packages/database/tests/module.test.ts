import { module } from '../src/functions/module'
import { moduleCondensed } from '../src/functions/moduleCondensed'
import { endpoint } from '../src/data-source'
import { setup } from './setup'
import { Module, ModuleCondensed } from '../src/entity'
import { remove, } from '../src/sql'
import { config } from '../src/config'

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
  const moduleList = await endpoint(moduleCondensed.get)
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
  const moduleList = await endpoint(moduleCondensed.getCodes)
  expect(moduleList).toBeDefined()
  expect(moduleList).toBeInstanceOf(Set)
  if (!moduleList) {
    return
  }
  expect(moduleList.size).toBeGreaterThan(lowerBound)
  expect(moduleList.size).toStrictEqual(total)
})

test('moduleCondensed.fetch', async () => {
  const moduleList = await endpoint(moduleCondensed.fetch)
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

test('moduleCondensed.pull', async () => {
  remove.tables(['moduleCondensed'])
  const pullOnEmpty = await endpoint(moduleCondensed.pull)
  const pullOnFull = await endpoint(moduleCondensed.pull)
  const written = await endpoint(moduleCondensed.get)

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

/* ===================================================================
 *   MODULE
 * ===================================================================
 */

test('module.get', async () => {
  const moduleList = await endpoint(module.get)
  expect(moduleList).toBeDefined()
  if (!moduleList) {
    return
  }
  /* make sure every element is a valid Module */
  moduleList.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  /* make sure that all moduleCodes are unique */
  const s = new Set(moduleList.map((m) => m.moduleCode))
  expect(s.size).toBe(moduleList.length)
  expect(s.size).toBeGreaterThan(lowerBound)
  expect(s.size).toStrictEqual(total)
})

test('module.getCodes', async () => {
  const moduleList = await endpoint(module.getCodes)
  expect(moduleList).toBeDefined()
  expect(moduleList).toBeInstanceOf(Set)
  if (!moduleList) {
    return
  }
  expect(moduleList.size).toBeGreaterThan(lowerBound)
  expect(moduleList.size).toStrictEqual(total)
})

test('moduleCondensed.fetch', async () => {
  const m = await endpoint(() => module.fetchOne("CS2040S"))
  expect(m).toBeDefined()
  if (!m) {
    return
  }
  expect(m).toBeInstanceOf(Module)
})

