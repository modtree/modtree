import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/types'
import { Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const entities = [User, Degree, Graph, Module, ModuleCondensed]

entities.forEach((entity) => {
  test(`${entity.name} has metadata`, () => {
    expect(db.hasMetadata(entity)).toBe(true)
  })
})

const expectedRelations = {
  User: {
    modulesDone: true,
    modulesDoing: true,
    savedDegrees: true,
    savedGraphs: true,
    mainDegree: true,
    mainGraph: true,
  },
  Degree: {
    modules: true,
  },
  Graph: {
    user: true,
    degree: true,
    modulesPlaced: true,
    modulesHidden: true,
  },
  Module: {},
  ModuleCondensed: {},
  ModuleFull: {},
}

test('User has correct relations', () => {
  const received = Repo.User.relations
  const expected = expectedRelations.User
  expect(received).toStrictEqual(expected)
})

test('Degree has correct relations', () => {
  const received = Repo.Degree.relations
  const expected = expectedRelations.Degree
  expect(received).toStrictEqual(expected)
})

test('Graph has correct relations', () => {
  const received = Repo.Graph.relations
  const expected = expectedRelations.Graph
  expect(received).toStrictEqual(expected)
})

test('Module has correct relations', () => {
  const received = Repo.Module.relations
  const expected = expectedRelations.Module
  expect(received).toStrictEqual(expected)
})

test('ModuleCondensed has correct relations', () => {
  const received = Repo.ModuleCondensed.relations
  const expected = expectedRelations.ModuleCondensed
  expect(received).toStrictEqual(expected)
})

test('ModuleFull has correct relations', () => {
  const received = Repo.ModuleFull.relations
  const expected = expectedRelations.ModuleFull
  expect(received).toStrictEqual(expected)
})
