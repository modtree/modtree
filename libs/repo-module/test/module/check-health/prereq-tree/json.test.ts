import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module } from '@modtree/entity'
import { getNestedCodes } from './get-nested-codes'

const dbName = oneUp(__filename)
const db = getSource(dbName)

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

it('is a json prereqTree', () => {
  modules.forEach((m) => {
    expect(m.prereqTree).toBePrereqTree()
  })
})

describe('nested codes', () => {
  const codes = new Set<string>()
  it('> 1000 codes', () => {
    modules.forEach((m) => {
      const res = getNestedCodes(m.prereqTree)
      expect(res.valid).toBe(true)
      res.codes.forEach((code) => codes.add(code))
    })
    expect(codes.size).toBeGreaterThan(1000)
  })

  test('< 800 outside of database', () => {
    const codeArr = Array.from(codes)
    const dbCodes = modules.map(flatten.module)
    codeArr.forEach((code) => {
      if (!dbCodes.includes(code)) {
        notInDb.add(code)
      }
    })
    expect(notInDb.size).toBeLessThan(800)
  })
})
