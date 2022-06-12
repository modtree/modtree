import { setup, teardown } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { endpoint, container, getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db, { initialize: false }))
/**
 * no need to cut connection because last test contains endpoint
 */
afterAll(() => teardown(db))

test('AppDataSource is defined', () => {
  expect(db).toBeDefined()
})

test('AppDataSource can be initialized and destroyed', async () => {
  await db.initialize()
  expect(db.isInitialized).toBe(true)
  await db.destroy()
  expect(db.isInitialized).toBe(false)
})

test('container is working', async () => {
  const res = await container(db, async () => {
    expect(db.isInitialized).toBe(true)
    return true
  })
  expect(res).toBe(true)
  expect(db.isInitialized).toBe(true)
  await db.destroy()
})

test('endpoint is working', async () => {
  const res = await endpoint(db, () =>
    container(db, async () => {
      expect(db.isInitialized).toBe(true)
      return true
    })
  )
  expect(res).toBe(true)
  expect(db.isInitialized).toBe(false)
})