import { container, endpoint, getSource } from '../src/data-source'
import { Module, ModuleCondensed } from '../src/entity'
import { ModuleRepository } from '../src/repository'
import { setup, importChecks, teardown } from './environment'
import { config, db as DefaultSource } from '../src/config'

const dbName = 'test_module'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, ModuleCondensed],
  repositories: [ModuleRepository(db)],
})

const lowerBound = 6000

describe('ModuleRepository.findByFaculty', () => {
  it('Valid faculty name', async () => {
    const res = await endpoint(db, () =>
      container(db, () => ModuleRepository(db).findByFaculty('Computing'))
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    res.forEach((module) => {
      expect(module).toBeInstanceOf(Module)
    })
    expect(res.length).toBeGreaterThan(100)
  })

  it('Invalid faculty name', async () => {
    const res = await endpoint(db, () =>
      container(db, () => ModuleRepository(db).findByFaculty('ABCDEFGH'))
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(0)
  })
})

test('fetch one module from NUSMods', async () => {
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).fetchOne('CS2040S'))
  )
  expect(res).toBeInstanceOf(Module)
})

test('build a module from props', () => {
  const module = ModuleRepository(db).build({
    acadYear: '2020',
    moduleCode: 'CS1010S',
    title: 'Winning',
    description: 'Read title',
    moduleCredit: '10',
    department: 'Games',
    faculty: 'Life',
    workload: '420',
    aliases: ['CS9999S'],
    attributes: {
      su: true,
    },
    prerequisite: 'CS1010S',
    semesterData: [],
  })
  expect(module).toBeInstanceOf(Module)
})

test('get all modules in database', async () => {
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).find())
  )
  expect(res).toBeInstanceOf(Array)
  if (!res) return
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(lowerBound)
})

test('fallback to default source', async () => {
  await setup(config.database)
  const res = await endpoint(DefaultSource, () =>
    container(DefaultSource, () => ModuleRepository().find())
  )
  expect(res).toBeInstanceOf(Array)
  if (!res) return
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(lowerBound)
  await teardown(config.database)
})

test('get all module codes in database', async () => {
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).getCodes())
  )
  if (!res) return
  expect(res).toBeInstanceOf(Array)
  expect(res.length).toBeGreaterThan(lowerBound)
})
