import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Repo, setup, teardown } from '@modtree/test-env'
import { ModuleCondensedRepository } from '../../src'
import { ModuleCondensed } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

test('moduleCondensed.getCodes', async () => {
  await Repo.ModuleCondensed!.getCodes().then((moduleList) => {
    expect(moduleList).toBeArrayOf(ModuleCondensed)
    expect(moduleList.length).toBeGreaterThan(6000)
  })
})
