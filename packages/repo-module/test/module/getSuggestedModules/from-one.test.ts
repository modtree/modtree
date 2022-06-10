import { setup, teardown, t, Repo } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleRepository } from '../../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const requiredModules = [
  'CS1010',
  'CG2111A', // in modulesDone, should not suggest
  'IT2002', // in modulesDoing, should not suggest
  'CS2030', // unlocks CS2104, CS3240, IS2103, IS2102 (4 mods)
  'CS2040S', // cannot take this mod (without CS1231)
  'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
  'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
  'CP2106', // unlocks 0 mods
]

const modulesDone = ['CS1010', 'CG2111A']
const modulesDoing = ['IT2002']

jest.setTimeout(15000)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
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

describe('getSuggestedModules (from one)', () => {
  describe('Suggests post-reqs of the given module', () => {
    it('Which the user is eligible for', async () => {
      const res = await Repo.Module.getSuggestedModules(
        modulesDone,
        modulesDoing,
        ['CS1010'],
        requiredModules
      )
      expect(res).toBeDefined()
      if (!res) return
      t.suggestedModulesCodes = res
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
      const res = await Repo.Module.findOneBy({ moduleCode: 'CS1010' })
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
