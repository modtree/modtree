import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { Module } from '../src/entity'
import { ModuleRepository } from '../src/repository'

beforeAll(async () => {
  await setup()
})

async function findByFaculty() {
  const res = await ModuleRepository.findByFaculty('Computing')
  return res
}

async function fetchOne() {
  const res = await ModuleRepository.fetchOne('CS2040S')
  return res
}

async function getAll() {
  const res = await ModuleRepository.find()
  return res
}

function build() {
  const res = ModuleRepository.build({
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
  return res
}

test('find modules by faculty', async () => {
  const res = await endpoint(async () => await container(findByFaculty))
  expect(res).toBeDefined()
  expect(res).not.toBeNull()
  if (!res) {
    return
  }
  expect(res).toBeInstanceOf(Array)
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
})

test('fetch one module from NUSMods', async () => {
  const res = await endpoint(async () => await container(fetchOne))
  expect(res).not.toBeNull()
  expect(res).toBeInstanceOf(Module)
})

test('build a module from props', () => {
  const res = build()
  expect(res).not.toBeNull()
  expect(res).toBeInstanceOf(Module)
})

test('get all modules in database', async () => {
  const res = await endpoint(async () => await container(getAll))
  expect(res).toBeDefined()
  expect(res).not.toBeNull()
  if (!res) {
    return
  }
  res.forEach((module) => {
    expect(module).toBeInstanceOf(Module)
  })
  expect(res.length).toBeGreaterThan(6100)
})
