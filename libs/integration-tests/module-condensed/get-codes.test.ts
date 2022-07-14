import { Repo, setup, teardown } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

test('returns an array of strings', async () => {
  await Repo.ModuleCondensed.getCodes().then((codes) => {
    codes.forEach((e) => expect(typeof e).toBe('string'))
    expect(codes.length).toBeGreaterThan(6000)
  })
})
