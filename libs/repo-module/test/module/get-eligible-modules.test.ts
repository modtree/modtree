import { setup, Repo, t, teardown } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

it('returns an array of strings', async () => {
  await Repo.Module!.getEligibleModules(['CS1101S'], [], []).then((codes) => {
    expect(codes).toBeInstanceOf(Array)
    codes.forEach((e) => expect(typeof e).toBe('string'))
    t.moduleCodes = codes
  })
})

it('returns correct modules', async () => {
  expect(t.moduleCodes).toIncludeSameMembers(['CS2109S'])
})

it('returns correct modules', async () => {
  await Repo.Module!.getEligibleModules([], [], ['CS1101S']).then((codes) => {
    expect(codes).toIncludeSameMembers(['CS2109S'])
  })
})
