import { flatten, oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { ModuleCondensed } from '@modtree/entity'
import { setup, teardown, Repo } from '@modtree/test-env'
import { getModuleCondensedRepository } from '../../src/ModuleCondensed'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = getModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

const lowerBound = 6000

test('moduleCondensed.fetch', async () => {
  await container(db, () =>
    Repo.ModuleCondensed.fetch().then((moduleList) => {
      expect(moduleList).toBeInstanceOf(Array)
      expect(moduleList[0]).toBeInstanceOf(ModuleCondensed)
      const s = new Set(moduleList.map(flatten.module))
      /**
       * expect all module codes to be unique
       */
      expect(s.size).toBe(moduleList.length)
      expect(s.size).toBeGreaterThan(lowerBound)
    })
  )
})
