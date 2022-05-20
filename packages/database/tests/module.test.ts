import { container, endpoint, getSource } from '../src/data-source'
import { Module } from '../src/entity'
import { ModuleRepository } from '../src/repository'
import { setup, importChecks } from './setup'

const dbName = 'test_module'
const db = getSource(dbName)

beforeAll(() => setup(dbName))

importChecks({
  entities: [Module],
  repositories: [ModuleRepository(db)],
})


test('find modules by faculty', async () => {
  const res = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).findByFaculty('Computing'))
  )
  if (!res) {
    return
  }
  expect(res).toBeInstanceOf(Array)
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(100)
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
  const res = await endpoint(db, () => container(db, () => ModuleRepository(db).find()))
  if (!res) {
    return
  }
  expect(res).toBeInstanceOf(Array)
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(6000)
})
