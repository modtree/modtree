import { endpoint } from '../src/data-source'
import { setup } from './setup'
import { Module } from '../src/entity'

const lowerBound = 6000

let total = 0

beforeAll(async () => {
  await setup()
})

test('module.get', async () => {
  const moduleList = await endpoint(Module.get)
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
  total = s.size
})

test('module.getCodes', async () => {
  const moduleList = await endpoint(Module.getCodes)
  expect(moduleList).toBeDefined()
  expect(moduleList).toBeInstanceOf(Set)
  if (!moduleList) {
    return
  }
  expect(moduleList.size).toBeGreaterThan(lowerBound)
  expect(moduleList.size).toStrictEqual(total)
})

test('moduleCondensed.fetch', async () => {
  const m = await endpoint(() => Module.fetchOne('CS2040S'))
  expect(m).toBeDefined()
  if (!m) {
    return
  }
  expect(m).toBeInstanceOf(Module)
})
