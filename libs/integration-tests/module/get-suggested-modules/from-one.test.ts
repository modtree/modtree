import { setup, Repo, t, teardown } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

export async function suggest(
  done: string[],
  doing: string[],
  selected: string[],
  required: string[]
) {
  return Repo.Module.getSuggestedModules(done, doing, selected, required)
}

it('returns an array of modules', async () => {
  await suggest(
    ['CS1010', 'CG2111A'],
    ['IT2002'],
    ['CS1010'],
    [
      'CS1010',
      'CG2111A', // in modulesDone, should not suggest
      'IT2002', // in modulesDoing, should not suggest
      'CS2030', // unlocks CS2104, CS3240, IS2103, IS2102 (4 mods)
      'CS2040S', // cannot take this mod (without CS1231)
      'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
      'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
      'CP2106', // unlocks 0 mods
    ]
  ).then((res) => {
    res.forEach((m) => expect(typeof m).toBe('string'))
    t.moduleCodes = res
  })
})

it('suggests correct modules', () => {
  expect(t.moduleCodes).toIncludeSameMembers([
    'CS2107',
    'CS2100',
    'CS2030',
    'CP2106',
    'CS2040C',
    'CS2040',
    'CS2030S',
  ])
})

it('ranks modules correctly', () => {
  expect(t.moduleCodes).toEqual([
    /**
     * part of degree
     */
    'CS2030', // unlocks 4 mods
    'CS2100', // unlocks 3 mods
    'CS2107', // unlocks 3 mods
    'CP2106', // unlocks 0 mods
    /**
     * outside of degree
     */
    'CS2040', // unlocks 7 mods
    'CS2040C', // unlocks 2 mods
    'CS2030S', // unlocks 0 mods
  ])
})
