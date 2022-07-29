import { Repo, setup, teardown } from '@modtree/test-env'
import { testDb } from '@modtree/typeorm-config'

beforeAll(() => setup(testDb, { restore: false }))
afterAll(() => teardown(testDb))

test('returns an array of strings', async () => {
  await Repo.ModuleCondensed.getCodes().then((codes) => {
    codes.forEach((e) => expect(typeof e).toBe('string'))
    expect(codes.length).toBeGreaterThan(6000)
  })
})
