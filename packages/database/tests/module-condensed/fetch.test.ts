import { flatten, oneUp } from '../../src/utils'
import { container, getSource } from '../../src/data-source'
import { ModuleCondensed } from '../../src/entity'
import { setup, teardown, Repo } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const lowerBound = 6000

test('moduleCondensed.fetch', async () => {
  await container(db, () =>
    Repo.ModuleCondensed
      .fetch()
      .then((moduleList) => {
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
