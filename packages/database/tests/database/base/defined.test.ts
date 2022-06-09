import { getSource } from '@src/data-source'
import { Module, ModuleCondensed, Degree, User, Graph } from '@modtree/entity'
import {
  getModuleRepository,
  getModuleCondensedRepository,
  getDegreeRepository,
  getUserRepository,
  getGraphRepository,
} from '@repository'
import { oneUp } from '@utils'
import { setup, teardown } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
beforeAll(() => teardown(db))

test('AppDataSource is defined', () => {
  expect(db).toBeDefined()
})

test('All entities are defined', () => {
  expect(Module).toBeDefined()
  expect(ModuleCondensed).toBeDefined()
  expect(Degree).toBeDefined()
  expect(User).toBeDefined()
  expect(Graph).toBeDefined()
})

test('All repositories are defined', async () => {
  expect(getModuleRepository(db)).toBeDefined()
  expect(getModuleCondensedRepository(db)).toBeDefined()
  expect(getDegreeRepository(db)).toBeDefined()
  expect(getUserRepository(db)).toBeDefined()
  expect(getGraphRepository(db)).toBeDefined()
})
