import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module } from '@modtree/entity'
import { validModuleCode } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const codesInJson = new Set<string>()
let modules: Module[]
const notInDb = new Set<string>()

beforeAll(() =>
  setup(db)
    .then(() => Repo.Module!.findAndCount())
    .then((res) => {
      modules = res[0].filter((m) => typeof m.prereqTree !== 'string')
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

describe('json prereqs', () => {
  it('is not an array', () => {
    modules.forEach((m) => {
      expect(Array.isArray(m.prereqTree)).toBe(false)
    })
  })

  it('contains and/or key', () => {
    modules.forEach((m) => {
      const keys = Object.keys(m.prereqTree)
      expect(['and', 'or']).toEqual(expect.arrayContaining(keys))
      expect(keys.length).toBeGreaterThan(0)
    })
  })

  it('values are arrays', () => {
    modules.forEach((m) => {
      Object.entries(m.prereqTree).forEach((entry) => {
        expect(entry[1]).toBeInstanceOf(Array)
        entry[1].forEach((e: string) => {
          expect(typeof e).toBe('string')
        })
      })
    })
  })
})
