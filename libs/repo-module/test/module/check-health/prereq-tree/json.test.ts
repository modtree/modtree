import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module } from '@modtree/entity'
import { NUSMods } from '@modtree/types'

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

function getNestedCodes(tree: NUSMods.PrereqTree, codes: Set<string>) {
  function recurse(tree: NUSMods.PrereqTree) {
    if (typeof tree === 'string') {
      codes.add(tree)
      return
    }
    if (tree.or) {
      tree.or.forEach(recurse)
    }
    if (tree.and) {
      tree.and.forEach(recurse)
    }
    if (Array.isArray(tree)) {
      tree.forEach((code) => codes.add(code))
    }
  }
  recurse(tree)
}

describe('nested codes', () => {
  const codes = new Set<string>()
  it('> 1000 codes', () => {
    modules.forEach((m) => {
      getNestedCodes(m.prereqTree, codes)
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

it('is a json prereqTree', () => {
  modules.forEach((m) => {
    expect(m.prereqTree).toBePrereqTree()
  })
})
