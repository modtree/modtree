import { setup, Repo, teardown } from '@modtree/test-env'
import { flatten, getNestedCodes } from '@modtree/utils'
import { Module } from '@modtree/types'
import { testDb } from '@modtree/typeorm-config'

let modules: Module[]
const notInDb = new Set<string>()

beforeAll(() =>
  setup(testDb, { restore: false })
    .then(() => Repo.Module.find())
    .then((res) => {
      modules = res.filter((m) => typeof m.prereqTree !== 'string')
    })
)
afterAll(() => teardown(testDb))

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
