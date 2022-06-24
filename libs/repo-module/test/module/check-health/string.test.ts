import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module } from '@modtree/entity'
import { validModuleCode } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const notInDb = new Set<string>()
let modules: Module[]

beforeAll(() =>
  setup(db)
    .then(() => Repo.Module!.find())
    .then((res) => {
      modules = res.filter((m) => typeof m.prereqTree === 'string')
    })
)
afterAll(() => teardown(db))

describe('module.prereqTree', () => {
  test('key exists', () => {
    modules.forEach((module) => {
      expect(module).toHaveProperty('prereqTree')
    })
  })
})

describe('string prereqs', () => {
  test('are valid codes', () => {
    modules.forEach((module) => {
      expect(validModuleCode(module.moduleCode)).toBe(true)
    })
  })
  test('< 70 outside of database', () => {
    const dbCodes = modules.map(flatten.module)
    modules.forEach((module) => {
      if (!dbCodes.includes(module.moduleCode)) {
        notInDb.add(module.moduleCode)
      }
    })
    expect(notInDb.size).toBeLessThan(70)
  })
})
