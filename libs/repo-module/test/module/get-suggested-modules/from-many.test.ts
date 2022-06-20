import { setup, teardown, Repo, t } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

it('returns an array of strings', async () => {
  await Repo.Module!.getSuggestedModules(
    ['CS1010', 'CG2111A', 'CS1231'], // done
    ['IT2002'], // doing
    ['CS1010', 'CS1231'], // selected
    [
      // required in degree
      'CS1010',
      'CS1231',
      'CG2111A',
      'IT2002',
      'CS2030',
      'CS2100',
      'CS2040S',
      'CS2107',
      'CP2106',
      'CS3234',
      'CS2109S',
    ]
  ).then((moduleCodes) => {
    moduleCodes.forEach((m) => expect(typeof m).toBe('string'))
    t.moduleCodes = moduleCodes
  })
})

it('suggests correct modules', async () => {
  expect(t.moduleCodes).toIncludeSameMembers([
    /* CS1010 unlocks */
    'CS2107',
    'CS2100',
    'CS2030',
    'CP2106',
    'CS2040C',
    'CS2040',
    'CS2030S',
    /* CS1231 unlocks */
    'CS3234',
    'MA2202',
    'MA2202S',
    'MA2214',
    'MA2219',
    'MA3205',
    'CS2109S',
    /* both required to unlock */
    'CS2040S',
  ])
})

it('ranks modules correctly', () => {
  expect(t.moduleCodes).toStrictEqual([
    /**
     * part of degree
     */
    'CS2030', // unlocks 5 mods
    'CS2100', // unlocks 3 mods
    'CS2107', // unlocks 3 mods
    'CS2040S', // unlocks 2 mods
    'CP2106', // unlocks 0 mods
    'CS2109S', // unlocks 0 mods
    'CS3234', // unlocks 0 mods
    /**
     * outside of degree
     */
    'CS2040', // unlocks 13 mods
    'CS2040C', // unlocks 2 mods
    'MA2214', // unlocks 1 mods
    'MA3205', // unlocks 1 mods
    'CS2030S', // unlocks 0 mods
    'MA2202', // unlocks 0 mods
    'MA2202S', // unlocks 0 mods
    'MA2219', // unlocks 0 mods
  ])
})
