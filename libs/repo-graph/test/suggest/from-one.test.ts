import { Module } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { InitProps } from '@modtree/types'
import { oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '../../src'
import { ModuleRepository } from '@modtree/repo-module'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const degreeProps: InitProps['Degree'] = {
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

const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['CS1010', 'CG2111A'],
  modulesDoing: ['IT2002'],
}

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: new UserRepository(db),
        Degree: new DegreeRepository(db),
        Graph: new GraphRepository(db),
        Module: new ModuleRepository(db),
      })
      return Promise.all([
        Repo.User!.initialize(userProps),
        Repo.Degree!.initialize(degreeProps),
      ])
    })
    .then(([user, degree]) =>
      Repo.Graph!.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: false,
      })
    )
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

const expected = [
  'CS2107',
  'CS2100',
  'CS2030',
  'CP2106',
  'CS2040C',
  'CS2040',
  'CS2030S',
]

describe('Graph.suggestModules (from one)', () => {
  describe('Suggests post-reqs of the given module', () => {
    it('Which the user is eligible for', async () => {
      const selectedModules = ['CS1010']
      const res = await container(db, () =>
        Repo.Graph!.suggestModules(t.graph!, selectedModules)
      )
      expect(res).toBeDefined()
      if (!res) return
      res.forEach((one) => {
        expect(one).toBeInstanceOf(Module)
      })
      t.suggestedModulesCodes = res.map((one) => one.moduleCode)
      const copy = [...t.suggestedModulesCodes]
      expect(copy.sort()).toStrictEqual(expected.sort())
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
      const res = await container(db, () =>
        Repo.Module!.findOneBy({ moduleCode: 'CS1010' })
      )
      expect(res).toBeDefined()
      if (!res) return
      t.postReqs = res.fulfillRequirements
      // main test
      const moduleCodes = ['MA3269', 'DSA3102']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs!.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes!.includes(code)).toEqual(false)
      })
    })

    it('Which the user has done', async () => {
      const moduleCodes = ['CG2111A']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs!.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes!.includes(code)).toEqual(false)
      })
    })

    it('Which the user is doing', async () => {
      const moduleCodes = ['IT2002']
      // confirm that these modules are indeed CS1010 postReqs
      moduleCodes.forEach((code) => {
        expect(t.postReqs!.includes(code)).toEqual(true)
        expect(t.suggestedModulesCodes!.includes(code)).toEqual(false)
      })
    })
  })
})
