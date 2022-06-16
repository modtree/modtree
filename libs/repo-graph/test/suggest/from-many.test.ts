import { teardown, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { suggest, suggestSetup } from './utils'
import { Module } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const degreeProps = {
  moduleCodes: [
    'CS1010',
    'CS1231',
    'CG2111A', // in modulesDone, should not suggest
    'IT2002', // in modulesDoing, should not suggest
    'CS2030', // unlocks CS2102, CS2104, CS3240, IS2103, IS2102 (5 mods)
    'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
    'CS2040S', // unlocks CS4269, CS5469 (2 mods, alias count as 2)
    'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
    'CP2106', // unlocks 0 mods
    'CS3234', // unlocks 0 mods
    'CS2109S', // unlocks 0 mods
  ],
  title: 'Test Degree',
}

const userProps = {
  ...init.user1,
  modulesDone: ['CS1010', 'CG2111A', 'CS1231'],
  modulesDoing: ['IT2002'],
}

jest.setTimeout(30000)

beforeAll(() => suggestSetup(db, userProps, degreeProps))
afterAll(() => teardown(db))

it('returns an array of modules', async () => {
  await suggest(t.graph!, ['CS1010', 'CS1231']).then((m) => {
    expect(m).toBeArrayOf(Module)
    // cache because this operation is expensive
    t.moduleCodes = m.map(flatten.module)
  })
})

it('suggests correct modules', () => {
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
