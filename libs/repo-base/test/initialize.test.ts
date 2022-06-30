import { setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db, { initialize: false }))
/**
 * no need to cut connection because last test contains endpoint
 */
afterAll(() => teardown(db))

test('data source is defined', () => {
  expect(db).toBeDefined()
})

test('data source can be initialized', async () => {
  await db.initialize()
  expect(db.isInitialized).toBe(true)
})

test('data source can be destroyed', async () => {
  await db.destroy()
  expect(db.isInitialized).toBe(false)
})
