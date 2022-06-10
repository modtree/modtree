import { Graph, Module, ModuleCondensed } from '@modtree/entity'
import { getDegreeRepository } from '@modtree/repo-degree'
import { getModuleCondensedRepository } from '@modtree/repo-module'
import { getUserRepository } from '@modtree/repo-user'
import { init, Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { flatten, oneUp } from '@modtree/utils'
import { EntityNotFoundError } from 'typeorm'

import { GraphRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ graph: Graph; moduleCodes: string[] }> = {}

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: getUserRepository(db),
        Degree: getDegreeRepository(db),
        Graph: new GraphRepository(db),
        ModuleCondensed: getModuleCondensedRepository(db),
      })
      return Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    })
    .then(([user, degree]) =>
      Repo.Graph.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: true,
      })
    )
    .then((graph) => {
      t.graph = graph
      const all = graph.degree.modules.map(flatten.module)
      all.push(...graph.user.modulesDone.map(flatten.module))
      all.push(...graph.user.modulesDoing.map(flatten.module))
      t.moduleCodes = Array.from(new Set(all))
    })
)
afterAll(() => teardown(db))

/**
 *
 * @param {string} moduleCode
 */
function returnsGraphAfterToggling(moduleCode: string) {
  expect.hasAssertions()
  it(`toggles ${moduleCode} and returns graph`, async () => {
    const returned = await Repo.Graph.toggleModule(t.graph, moduleCode)
    expect(returned).toStrictEqual(t.graph)
  })
}

/**
 *
 * @param {string} moduleCode
 */
function expectInitiallyHidden(moduleCode: string) {
  expect.hasAssertions()
  it(`${moduleCode} is initially hidden`, async () => {
    await Repo.Graph.findOneById(t.graph.id).then((graph) => {
      const hidden = graph.modulesHidden.map(flatten.module)
      expect(hidden).toContain(moduleCode)
    })
  })
}

/**
 *
 * @param {string} moduleCode
 */
function expectInitiallyPlaced(moduleCode: string) {
  expect.hasAssertions()
  it(`${moduleCode} is initially placed`, async () => {
    await Repo.Graph.findOneById(t.graph.id).then((graph) => {
      const placed = graph.modulesPlaced.map(flatten.module)
      expect(placed).toContain(moduleCode)
    })
  })
}

/**
 *
 * @param {string} moduleCode
 */
function expectFinallyHidden(moduleCode: string) {
  expect.hasAssertions()
  it(`${moduleCode} successfully hidden`, async () => {
    const { modulesPlaced, modulesHidden } = t.graph
    expect(modulesHidden.map(flatten.module)).toContain(moduleCode)
    expect(modulesPlaced.map(flatten.module)).not.toContain(moduleCode)
  })
}

/**
 *
 * @param {string} moduleCode
 */
function expectFinallyPlaced(moduleCode: string) {
  expect.hasAssertions()
  it(`${moduleCode} successfully placed`, async () => {
    const { modulesPlaced, modulesHidden } = t.graph
    expect(modulesHidden.map(flatten.module)).not.toContain(moduleCode)
    expect(modulesPlaced.map(flatten.module)).toContain(moduleCode)
  })
}

describe('hidden -> placed', () => {
  expectInitiallyHidden('MA2001')
  returnsGraphAfterToggling('MA2001')
  expectFinallyPlaced('MA2001')
})

describe('placed -> hidden', () => {
  expectInitiallyPlaced('MA2001')
  returnsGraphAfterToggling('MA2001')
  expectFinallyHidden('MA2001')
})

describe('insert unseen module', () => {
  it('is a fresh module', async () => {
    expect.hasAssertions()
    await Repo.Graph.findOneById(t.graph.id).then((graph) => {
      const { modulesPlaced, modulesHidden } = graph
      const placed = modulesPlaced.map(flatten.module)
      const hidden = modulesHidden.map(flatten.module)
      expect(placed).not.toContain('EE1111A')
      expect(hidden).not.toContain('EE1111A')
    })
  })
  returnsGraphAfterToggling('EE1111A')
  expectFinallyPlaced('EE1111A')
})

describe('reject module not in database', () => {
  it('is not in database', async () => {
    expect.hasAssertions()
    await expect(() =>
      Repo.ModuleCondensed.findOneByOrFail({ moduleCode: 'CS420BZT' })
    ).rejects.toThrowError(
      new EntityNotFoundError(ModuleCondensed, {
        moduleCode: 'CS420BZT',
      })
    )
  })
  it('rejects the module', async () => {
    expect.hasAssertions()
    await expect(() =>
      Repo.Graph.toggleModule(t.graph, 'CS420BZT')
    ).rejects.toThrowError(
      new EntityNotFoundError(Module, {
        moduleCode: 'CS420BZT',
      })
    )
  })
})
