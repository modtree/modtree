import { getSource } from '../../src/data-source'
import { Module, ModuleCondensed, Degree, User, Graph } from '../../src/entity'
import {
  ModuleRepository,
  ModuleCondensedRepository,
  DegreeRepository,
  UserRepository,
  GraphRepository,
} from '../../src/repository'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

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

test('All repositories are defined', () => {
  expect(ModuleRepository(db)).toBeDefined()
  expect(ModuleCondensedRepository(db)).toBeDefined()
  expect(DegreeRepository(db)).toBeDefined()
  expect(UserRepository(db)).toBeDefined()
  expect(GraphRepository(db)).toBeDefined()
})
