import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module, ModuleCondensed } from '@modtree/entity'
import { validModuleCode } from '@modtree/utils'
import { NUSMods } from '@modtree/types'

type Category = 'emptyString' | 'moduleCode' | 'json' | 'modules' | 'condensed'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const count: Record<Category, number> = {
  modules: 0,
  condensed: 0,
  emptyString: 0,
  moduleCode: 0,
  json: 0,
}

type PrereqTreeTestProps = {
  emptyString: string[]
  moduleCode: string[]
  json: NUSMods.PrereqTree[]
}

const prereqTree: PrereqTreeTestProps = {
  emptyString: [],
  moduleCode: [],
  json: [],
}
const notInDb = new Set<string>()
let modules: Module[]
let condensed: ModuleCondensed[]

beforeAll(() =>
  setup(db).then(() =>
    Promise.all([
      Repo.ModuleCondensed!.findAndCount(),
      Repo.Module!.findAndCount(),
    ]).then((res) => {
      count.condensed = res[0][1]
      count.modules = res[1][1]
      condensed = res[0][0]
      modules = res[1][0]
    })
  )
)
afterAll(() => teardown(db))

test('has at least 6000 modules', () => {
  expect(count.modules).toBeGreaterThan(6000)
})

test('has at least 6000 condensed modules', () => {
  expect(count.condensed).toBeGreaterThan(6000)
})

test('has same module count', () => {
  expect(count.modules).toEqual(count.condensed)
})

test('has same module codes', () => {
  const codes = {
    modules: modules.map(flatten.module),
    condensed: condensed.map(flatten.module),
  }
  expect(codes.modules).toIncludeSameMembers(codes.condensed)
})

describe('module.prereqTree', () => {
  test('key exists', () => {
    modules.forEach((module) => {
      expect(module).toHaveProperty('prereqTree')
    })
  })

  test('split by type', () => {
    /**
     * split up all modules into three categories
     */
    modules.forEach((module) => {
      const tree = module.prereqTree
      if (typeof tree === 'string') {
        if (tree === '') {
          prereqTree.emptyString.push(tree)
        } else {
          prereqTree.moduleCode.push(tree)
        }
      } else {
        prereqTree.json.push(tree)
      }
    })
    /**
     * update the counts
     */
    count.json = prereqTree.json.length
    count.emptyString = prereqTree.emptyString.length
    count.moduleCode = prereqTree.moduleCode.length
    /**
     * check that the sum is correct
     */
    const sum = count.json + count.emptyString + count.moduleCode
    expect(sum).toEqual(count.modules)
  })
})

describe('prereq as strings', () => {
  test('are valid codes', () => {
    prereqTree.moduleCode.forEach((code) => {
      expect(validModuleCode(code)).toBe(true)
    })
  })
  test('exist in database: < 70', () => {
    const dbCodes = condensed.map(flatten.module)
    prereqTree.moduleCode.forEach((code) => {
      if (!dbCodes.includes(code)) {
        notInDb.add(code)
      }
    })
    expect(notInDb.size).toBeLessThan(70)
  })
})

describe('prereq as json', () => {
  it('is not an array', () => {
    prereqTree.json.forEach((json) => {
      expect(Array.isArray(json)).toBe(false)
    })
  })

  it('contains and/or key', () => {
    prereqTree.json.forEach((json) => {
      const keys = Object.keys(json)
      expect(['and', 'or']).toEqual(expect.arrayContaining(keys))
      expect(keys.length).toBeGreaterThan(0)
    })
  })

  it('values are arrays', () => {
    prereqTree.json.forEach((json) => {
      Object.entries(json).forEach((entry) => {
        console.log(entry[1])
        expect(entry[1]).toBeInstanceOf(Array)
      })
    })
  })
})
