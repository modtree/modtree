import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Repo, setup, teardown } from '@modtree/test-env'
import { ModuleCondensedRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

test('returns an array of strings', async () => {
  await Repo.ModuleCondensed!.getCodes().then((codes) => {
    codes.forEach((e) => expect(typeof e).toBe('string'))
    expect(codes.length).toBeGreaterThan(6000)
  })
})
