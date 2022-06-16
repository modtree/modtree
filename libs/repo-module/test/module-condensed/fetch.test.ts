import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleCondensed } from '@modtree/entity'
import { setup, teardown, Repo } from '@modtree/test-env'
import { ModuleCondensedRepository } from '../../src/ModuleCondensed'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

test('moduleCondensed.fetch', async () => {
  await Repo.ModuleCondensed!.fetch().then((modules) => {
    expect(modules).toBeArrayOf(ModuleCondensed)
    const s = new Set(modules.map(flatten.module))
    /* expect all module codes to be unique */
    expect(s.size).toBe(modules.length)
    expect(s.size).toBeGreaterThan(6000)
  })
})
