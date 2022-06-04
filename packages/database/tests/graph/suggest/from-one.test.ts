import { container, endpoint, getSource } from '../../../src/data-source'
import { Degree, User, Module, Graph } from '../../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  GraphRepository,
  ModuleRepository,
} from '../../../src/repository'
import { setup, importChecks, teardown } from '../../environment'
import Mockup from '../../mockup'
import type * as InitProps from '../../../types/init-props'
import Init from '../../init'

const dbName = 'test_suggest_modules_from_one'
const db = getSource(dbName)
const t: Partial<{
  graph: Graph
  suggestedModulesCodes: string[]
  postReqs: string[]
}> = {}

const degreeProps: InitProps.Degree = {
  moduleCodes: [
    'CS1010',
    'CG2111A', // in modulesDone, should not suggest
    'IT2002', // in modulesDoing, should not suggest
    'CS2030', // unlocks CS2104, CS3240, IS2103, IS2102 (4 mods)
    'CS2040S', // cannot take this mod (without CS1231)
    'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
    'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
    'CP2106', // unlocks 0 mods
  ],
  title: 'Custom Degree',
}

const userProps: InitProps.User = {
  ...Init.emptyUser,
  modulesDone: ['CS1010', 'CG2111A'],
  modulesDoing: ['IT2002'],
}

beforeAll(async () => {
  await setup(dbName)
    .then(() => Mockup.graph(db, userProps, degreeProps))
    .then((res) => {
      t.graph = res.graph
    })
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
        GraphRepository(db).suggestModulesFromOne(t.graph, 'CS1010')
      )
      expect(res).toBeDefined()
      if (!res) return
      res.forEach((one) => {
        expect(one).toBeInstanceOf(Module)
      })
      t.suggestedModulesCodes = res.map((one) => one.moduleCode)
      const copy = [...t.suggestedModulesCodes]
      expect(copy.sort()).toEqual(expected.sort())
    })

    it('In our current desired priority', async () => {
      // unlocks 4, 3, 3, 0 mods
      const degreeModules = ['CS2030', 'CS2100', 'CS2107', 'CP2106']
      // unlocks 7, 2, 0 mods
      const nonDegreeModules = ['CS2040', 'CS2040C', 'CS2030S']
      const expected = degreeModules.concat(nonDegreeModules)
      expect(t.suggestedModulesCodes).toEqual(expected)
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
      t.postReqs = res.fulfillRequirements
      // main test
      const moduleCodes = ['MA3269', 'DSA3102']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })

    it('Which the user has done', async () => {
      const moduleCodes = ['CG2111A']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })

    it('Which the user is doing', async () => {
      const moduleCodes = ['IT2002']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes.includes(code)).toEqual(false)
      })
    })
  })
})
