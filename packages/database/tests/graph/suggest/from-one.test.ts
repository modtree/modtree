import { container, endpoint, getSource } from '../../../src/data-source'
import { Degree, User, Module, Graph } from '../../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  GraphRepository,
  ModuleRepository,
} from '../../../src/repository'
import { setup, importChecks, teardown } from '../../environment'
import { setupGraph } from './setup'

const dbName = 'test_suggest_modules_from_one'
const db = getSource(dbName)
// TODO: change to t.
// Entities that will be created
let graph: Graph
// Data that will be populated
let suggestedModulesCodes: string[]
let postReqs: string[]

beforeAll(async () => {
  await setup(dbName)
  const res = await setupGraph(db)
  if (!res) throw new Error('Unable to setup Graph test.')
  graph = res
})
afterAll(() => teardown(dbName))

// TODO: remove
importChecks({
  entities: [Module, Degree, User, Graph],
  repositories: [
    ModuleRepository(db),
    UserRepository(db),
    DegreeRepository(db),
    GraphRepository(db),
  ],
})

const expected = [
  'CS2107',
  'CS2100',
  'CS2030',
  'CP2106',
  'CS2040C',
  'CS2040',
  'CS2030S',
]

describe('Graph.initialize', () => {
  describe('Suggests post-reqs of the given module', () => {
    it('Which the user is eligible for', async () => {
      const res = await container(db, () =>
        GraphRepository(db).suggestModulesFromOne(graph, 'CS1010')
      )
      expect(res).toBeDefined()
      if (!res) return
      res.forEach((one) => {
        expect(one).toBeInstanceOf(Module)
      })
      suggestedModulesCodes = res.map((one) => one.moduleCode)
      const copy = [...suggestedModulesCodes]
      expect(copy.sort()).toEqual(expected.sort())
    })

    it('In our current desired priority', async () => {
      // unlocks 4, 3, 3, 0 mods
      const degreeModules = ['CS2030', 'CS2100', 'CS2107', 'CP2106']
      // unlocks 7, 2, 0 mods
      const nonDegreeModules = ['CS2040', 'CS2040C', 'CS2030S']
      const expected = degreeModules.concat(nonDegreeModules)
      expect(suggestedModulesCodes).toEqual(expected)
    })
  })

  describe('Does not suggest post-reqs of the given module', () => {
    it('Which the user is not eligible for', async () => {
      // get postReqs
      const res = await endpoint(db, () =>
        container(db, () =>
          ModuleRepository(db).findOneBy({ moduleCode: 'CS1010' })
        )
      )
      expect(res).toBeDefined()
      if (!res) return
      postReqs = res.fulfillRequirements
      // main test
      const moduleCodes = ['MA3269', 'DSA3102']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(postReqs.includes(code)).toEqual(true)
        expect(suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })

    it('Which the user has done', async () => {
      const moduleCodes = ['CG2111A']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(postReqs.includes(code)).toEqual(true)
        expect(suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })

    it('Which the user is doing', async () => {
      const moduleCodes = ['IT2002']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(postReqs.includes(code)).toEqual(true)
        expect(suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })
  })
})
