import { setup, teardown } from '@modtree/test-env'
import { container, endpoint, getSource } from '@modtree/typeorm-config'
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

test('container opens connection', async () => {
  await container(db, async () => {
    expect(db.isInitialized).toBe(true)
  })
})

test('container leaves connection open', async () => {
  expect(db.isInitialized).toBe(true)
  await db.destroy()
})

test('endpoint opens connection', async () => {
  await endpoint(db, () =>
    container(db, async () => {
      expect(db.isInitialized).toBe(true)
    })
  )
})

test('endpoint closes connection', () => {
  expect(db.isInitialized).toBe(false)
})
