import { setup, teardown, Repo } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Module } from '@modtree/entity'
import { validModuleCode } from '@modtree/utils'
import { NUSMods } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

type PrereqTreeTestProps = {
  string: string[]
  json: NUSMods.PrereqTree[]
}

const tree: PrereqTreeTestProps = {
  string: [],
  json: [],
}

const notInDb = new Set<string>()
let modules: Module[]

beforeAll(() =>
  setup(db)
    .then(() => Repo.Module!.find())
    .then((res) => {
      modules = res
    })
)
afterAll(() => teardown(db))

describe('module.prereqTree', () => {
  test('key exists', () => {
    modules.forEach((module) => {
      expect(module).toHaveProperty('prereqTree')
      const prereqTree = module.prereqTree
      if (typeof prereqTree === 'string') {
        if (prereqTree !== '') tree.string.push(prereqTree)
      } else {
        tree.json.push(prereqTree)
      }
    })
  })
})

describe('string prereqs', () => {
  test('are valid codes', () => {
    tree.string.forEach((code) => {
      expect(validModuleCode(code)).toBe(true)
    })
  })
  test('< 70 outside of database', () => {
    const dbCodes = modules.map(flatten.module)
    tree.string.forEach((code) => {
      if (!dbCodes.includes(code)) {
        notInDb.add(code)
      }
    })
    expect(notInDb.size).toBeLessThan(70)
  })
})
