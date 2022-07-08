import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/types'
import { Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { getRelations } from '.'

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
}

test('User has correct relations', () => {
  const received = getRelations(Repo.User)
  const expected = expectedRelations.User
  expect(received).toStrictEqual(expected)
})

test('Degree has correct relations', () => {
  const received = getRelations(Repo.Degree)
  const expected = expectedRelations.Degree
  expect(received).toStrictEqual(expected)
})

test('Graph has correct relations', () => {
  const received = getRelations(Repo.Graph)
  const expected = expectedRelations.Graph
  expect(received).toStrictEqual(expected)
})

test('Module has correct relations', () => {
  const received = getRelations(Repo.Module)
  const expected = expectedRelations.Module
  expect(received).toStrictEqual(expected)
})

test('ModuleCondensed has correct relations', () => {
  const received = getRelations(Repo.ModuleCondensed)
  const expected = expectedRelations.ModuleCondensed
  expect(received).toStrictEqual(expected)
})
