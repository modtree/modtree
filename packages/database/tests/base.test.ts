import { setup } from './setup'
import { AppDataSource, container, endpoint } from '../src/data-source'
import { Module, ModuleCondensed, Degree, User } from '../src/entity'
import {
  ModuleRepository,
  ModuleCondensedRepository,
  DegreeRepository,
  UserRepository,
} from '../src/repository'

beforeAll(async () => {
  await setup()
})

test('AppDataSource is defined', () => {
  expect(AppDataSource).toBeDefined()
})

test('All entities are defined', () => {
  expect(Module).toBeDefined()
  expect(ModuleCondensed).toBeDefined()
  expect(Degree).toBeDefined()
  expect(User).toBeDefined()
})

test('All repositories are defined', () => {
  expect(ModuleRepository).toBeDefined()
  expect(ModuleCondensedRepository).toBeDefined()
  expect(DegreeRepository).toBeDefined()
  expect(UserRepository).toBeDefined()
})
test('AppDataSource can be initialized and destroyed', async () => {
  await AppDataSource.initialize()
  expect(AppDataSource.isInitialized).toBe(true)
  await AppDataSource.destroy()
  expect(AppDataSource.isInitialized).toBe(false)
})

test('container is working', async () => {
  const res = await container(async () => {
    expect(AppDataSource.isInitialized).toBe(true)
    return true
  })
  expect(res).toBe(true)
  expect(AppDataSource.isInitialized).toBe(true)
  await AppDataSource.destroy()
})

test('container can run repo function', async () => {
  const res = await container(() =>
    ModuleCondensedRepository.findOneBy({
      moduleCode: 'CS1010S',
    })
  )
  expect(res).toBeInstanceOf(ModuleCondensed)
  expect(AppDataSource.isInitialized).toBe(true)
  await AppDataSource.destroy()
})

test('endpoint is working', async () => {
  const res = await endpoint(() =>
    container(async () => {
      expect(AppDataSource.isInitialized).toBe(true)
      return true
    })
  )
  expect(res).toBe(true)
  expect(AppDataSource.isInitialized).toBe(false)
})

test('endpoint can run repo function', async () => {
  // retrieve all modules from the Computing faculty
  const res = await endpoint(() =>
    container(() => ModuleRepository.findByFaculty('Computing'))
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
  expect(AppDataSource.isInitialized).toBe(false)
})
