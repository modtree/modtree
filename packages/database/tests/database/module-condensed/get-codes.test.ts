import { oneUp, } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { Repo, setup, teardown } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const lowerBound = 6000

test('moduleCondensed.getCodes', async () => {
  const moduleList = await container(db, () => Repo.ModuleCondensed.getCodes())
  expect(moduleList).toBeDefined()
  if (!moduleList) return
  expect(moduleList).toBeInstanceOf(Array)
  moduleList.forEach((moduleCode) => {
    expect(typeof moduleCode).toBe('string')
  })
  expect(moduleList.length).toBeGreaterThan(lowerBound)
})
