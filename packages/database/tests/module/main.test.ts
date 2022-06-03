import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { ModuleRepository } from '../../src/repository'
import { oneUp } from '../../src/utils'
import { setup, teardown } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

const lowerBound = 6000

describe('ModuleRepository.findByFaculty', () => {
  it('Valid faculty name', async () => {
    const res = await container(db, () =>
      ModuleRepository(db).findByFaculty('Computing')
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    res.forEach((module) => {
      expect(module).toBeInstanceOf(Module)
    })
    expect(res.length).toBeGreaterThan(100)
  })

  it('Invalid faculty name', async () => {
    const res = await container(db, () =>
      ModuleRepository(db).findByFaculty('ABCDEFGH')
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(0)
  })
})

test('fetch one module from NUSMods', async () => {
  const res = await container(db, () =>
    ModuleRepository(db).fetchOne('CS2040S')
  )
  expect(res).toBeInstanceOf(Module)
})

test('build a module from props', () => {
  const module = ModuleRepository(db).create({
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
  const res = await container(db, () => ModuleRepository(db).find())
  expect(res).toBeInstanceOf(Array)
  if (!res) return
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(lowerBound)
})

test('get all module codes in database', async () => {
  const res = await container(db, () => ModuleRepository(db).getCodes())
  if (!res) return
  expect(res).toBeInstanceOf(Array)
  expect(res.length).toBeGreaterThan(lowerBound)
})
