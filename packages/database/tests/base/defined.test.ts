import { setup, teardown } from '../environment'
import { getSource } from '../../src/data-source'
import { Module, ModuleCondensed, Degree, User } from '../../src/entity'
import {
  ModuleRepository,
  ModuleCondensedRepository,
  DegreeRepository,
  UserRepository,
} from '../../src/repository'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

test('AppDataSource is defined', () => {
  expect(db).toBeDefined()
})

test('All entities are defined', () => {
  expect(Module).toBeDefined()
  expect(ModuleCondensed).toBeDefined()
  expect(Degree).toBeDefined()
  expect(User).toBeDefined()
})

test('All repositories are defined', () => {
  expect(ModuleRepository(db)).toBeDefined()
  expect(ModuleCondensedRepository(db)).toBeDefined()
  expect(DegreeRepository(db)).toBeDefined()
  expect(UserRepository(db)).toBeDefined()
})
