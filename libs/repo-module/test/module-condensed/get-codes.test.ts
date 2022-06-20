import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Repo, setup, teardown } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('returns an array of strings', async () => {
  await Repo.ModuleCondensed!.getCodes().then((codes) => {
    codes.forEach((e) => expect(typeof e).toBe('string'))
    expect(codes.length).toBeGreaterThan(6000)
  })
})
