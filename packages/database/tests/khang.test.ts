import { AppDataSource, container, endpoint } from '../src/data-source'
import { setup } from './setup'
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

test('container is working', async () => {
  const res = await container(async () => {
    expect(AppDataSource.isInitialized).toBe(true)
    return true
  })
  expect(res).toBe(true)
  expect(AppDataSource.isInitialized).toBe(true)
  await AppDataSource.destroy()
})

test('endpoint is working', async () => {
  const res = await endpoint(() => container(async() => {
    expect(AppDataSource.isInitialized).toBe(true)
    return true
  }))
  expect(res).toBe(true)
  expect(AppDataSource.isInitialized).toBe(false)
})

test('AppDataSource can be initialized and destroyed', async () => {
  await AppDataSource.initialize()
  expect(AppDataSource.isInitialized).toBe(true)
  await AppDataSource.destroy()
  expect(AppDataSource.isInitialized).toBe(false)
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
