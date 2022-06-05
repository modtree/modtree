import { oneUp } from '../../src/utils'
import { container, getSource } from '../../src/data-source'
import { ModuleCondensedRepository } from '../../src/repository'
import { setup, teardown } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const lowerBound = 6000

test('moduleCondensed.getCodes', async () => {
  const moduleList = await container(db, () =>
    ModuleCondensedRepository(db).getCodes()
  )
  expect(moduleList).toBeDefined()
  if (!moduleList) return
  expect(moduleList).toBeInstanceOf(Array)
  moduleList.forEach((moduleCode) => {
    expect(typeof moduleCode).toBe('string')
  })
  expect(moduleList.length).toBeGreaterThan(lowerBound)
})
