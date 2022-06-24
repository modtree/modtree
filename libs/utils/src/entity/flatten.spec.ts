import { flatten } from '.'
import { Degree, Graph, Module, ModuleCondensed, User } from '@modtree/entity'

function makeModule(moduleCode: string) {
  const a = new Module()
  a.moduleCode = moduleCode
  return a
}

const degree = new Degree()
degree.id = 'degree_id'
degree.modules = [makeModule('CS2030'), makeModule('CS2040')]

const user = new User()
user.id = 'user_id'
user.savedDegrees = [degree]
user.modulesDone = [makeModule('MA1100'), makeModule('MA2001')]
user.modulesDoing = [makeModule('MA2001'), makeModule('MA2101')]

const graph = new Graph()
graph.id = 'graph_id'
graph.user = user
graph.degree = degree
graph.modulesHidden = [makeModule('CM1102'), makeModule('PC1432')]
graph.modulesPlaced = [makeModule('CS1231'), makeModule('MA2219')]
user.savedGraphs = [graph]

describe('Module', () => {
  test('flattens one', () => {
    const module = makeModule('CS1010')
    expect(flatten.module(module)).toEqual('CS1010')
  })

  test('errors on invalid', () => {
    expect(() => flatten.module(new Module())).toThrowError(
      "Can't flatten a module without a module code."
    )
  })
})

describe('Module Condensed', () => {
  test('flattens one', () => {
    const module = makeModule('CS1010')
    expect(flatten.module(module)).toEqual('CS1010')
  })

  test('errors on invalid', () => {
    expect(() => flatten.module(new ModuleCondensed())).toThrowError(
      "Can't flatten a module without a module code."
    )
  })
})

describe('Degree', () => {
  test('flattens one', () => {
    expect(flatten.degree(degree)).toEqual({
      id: 'degree_id',
      modules: ['CS2030', 'CS2040'],
    })
  })

  test('errors on invalid', () => {
    expect(() => flatten.degree(new Degree())).toThrowError()
  })
})

describe('User', () => {
  test('flattens one', () => {
    expect(flatten.user(user)).toEqual({
      id: 'user_id',
      modulesDone: ['MA1100', 'MA2001'],
      modulesDoing: ['MA2001', 'MA2101'],
      savedDegrees: ['degree_id'],
      savedGraphs: ['graph_id'],
    })
  })

  test('errors on invalid', () => {
    expect(() => flatten.user(new User())).toThrowError()
  })
})

describe('Graph', () => {
  test('flattens one', () => {
    expect(flatten.graph(graph)).toEqual({
      id: 'graph_id',
      modulesHidden: ['CM1102', 'PC1432'],
      modulesPlaced: ['CS1231', 'MA2219'],
      user: 'user_id',
      degree: 'degree_id',
    })
  })

  test('errors on invalid', () => {
    expect(() => flatten.graph(new Graph())).toThrowError()
  })
})
