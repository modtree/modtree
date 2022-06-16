import { Module } from '@modtree/entity'
import { Repo, init, t, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { flatten, oneUp } from '@modtree/utils'
import { suggest, suggestSetup } from './utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const degreeProps = {
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

const userProps = {
  ...init.user1,
  modulesDone: ['CS1010', 'CG2111A'],
  modulesDoing: ['IT2002'],
}

beforeAll(() => suggestSetup(db, userProps, degreeProps))
afterAll(() => teardown(db))

it('returns an array of modules', async () => {
  await suggest(t.graph!, ['CS1010']).then((m) => {
    expect(m).toBeArrayOf(Module)
    // cache because this operation is expensive
    t.moduleCodes = m.map(flatten.module)
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

test('CS1010 has post-reqs', async () => {
  await Repo.Module!.findOneByOrFail({ moduleCode: 'CS1010' }).then(
    (module) => {
      const codes = module.fulfillRequirements
      expect(codes).toBeInstanceOf(Array)
      expect(codes.length).toBeGreaterThan(0)
      t.postReqsCodes = codes
    }
  )
})

describe('MA3269: not eligible, hence not suggested', () => {
  it('MA3269 is a post-req of CS1010', () => {
    expect(t.postReqsCodes).toContain('MA3269')
  })

  it('user is not eligible for MA3269', async () => {
    await Repo.User!.canTakeModule(t.user!, 'MA3269').then((res) => {
      expect(res).toBe(false)
    })
  })

  it('MA3269 is not suggested', () => {
    expect(t.moduleCodes).not.toContain('MA3269')
  })
})

describe('CG2111A: already done, hence not suggested', () => {
  it('CG2111A is already done', () => {
    expect(t.user!.modulesDone.map(flatten.module)).toContain('CG2111A')
  })

  it('CG2111A is not suggested', () => {
    expect(t.moduleCodes).not.toContain('CG2111A')
  })
})

describe('IT2002: already doing, hence not suggested', () => {
  it('IT2002 is already in progress', () => {
    expect(t.user!.modulesDoing.map(flatten.module)).toContain('IT2002')
  })

  it('IT2002 is not suggested', () => {
    expect(t.moduleCodes).not.toContain('IT2002')
  })
})
