import { setup, Repo, teardown } from '@modtree/test-env'
import { flatten } from '@modtree/utils'
import { Module, ModuleCondensed } from '@modtree/entity'
import { db } from '@modtree/typeorm-config'

const count = {
  modules: 0,
  condensed: 0,
}
let modules: Module[]
let condensed: ModuleCondensed[]

beforeAll(() =>
  setup(db, { restore: false }).then(() =>
    Promise.all([
      Repo.ModuleCondensed.findAndCount(),
      Repo.Module.findAndCount(),
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
