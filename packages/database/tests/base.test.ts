import { setup } from './setup'
import { container, endpoint, getSource } from '../src/data-source'
import { Module, ModuleCondensed, Degree, User } from '../src/entity'
import {
  ModuleRepository,
  ModuleCondensedRepository,
  DegreeRepository,
  UserRepository,
} from '../src/repository'

const dbName = 'test_base'
const db = getSource(dbName)

beforeAll(() => setup(dbName))

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
test('AppDataSource can be initialized and destroyed', async () => {
  await db.initialize()
  expect(db.isInitialized).toBe(true)
  await db.destroy()
  expect(db.isInitialized).toBe(false)
})

test('container is working', async () => {
  const res = await container(db, async () => {
    expect(db.isInitialized).toBe(true)
    return true
  })
  expect(res).toBe(true)
  expect(db.isInitialized).toBe(true)
  await db.destroy()
})

test('container can run repo function', async () => {
  const res = await container(db, () =>
    ModuleCondensedRepository(db).findOneBy({
      moduleCode: 'CS1010S',
    })
  )
  expect(res).toBeInstanceOf(ModuleCondensed)
  expect(db.isInitialized).toBe(true)
  await db.destroy()
})

test('endpoint is working', async () => {
  const res = await endpoint(db, () =>
    container(db, async () => {
      expect(db.isInitialized).toBe(true)
      return true
    })
  )
  expect(res).toBe(true)
  expect(db.isInitialized).toBe(false)
})

test('endpoint can run repo function', async () => {
  // retrieve all modules from the Computing faculty
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).findByFaculty('Computing'))
  )
  expect(res).toBeInstanceOf(Array)
  // check definition and ditch void to keep typescript happy
  expect(res).toBeDefined()
  if (!res) {
    return
  }
  // ensure that all elements are instances of Module
  res.forEach((m) => {
    expect(m).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(10)
  expect(db.isInitialized).toBe(false)
})
