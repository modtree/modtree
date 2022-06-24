import { setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { DataSource } from 'typeorm'
import { db as defaultSource } from '@modtree/typeorm-config'
import { getDataSource } from '.'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const sampleSource = new DataSource({
  type: 'postgres',
})

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('sample source is legit', () => {
  expect(sampleSource).toBeInstanceOf(DataSource)
})

test("defaults to config's db", () => {
  const db = getDataSource()
  expect(db).toStrictEqual(defaultSource)
})

test('sets correct db', () => {
  const db = getDataSource(sampleSource)
  expect(db.options.type).toBe('postgres')
  expect(db.options.entities).not.toBeDefined()
  expect(db.options.migrations).not.toBeDefined()
  expect(db.options.database).not.toBeDefined()
  expect(db.options.synchronize).not.toBeDefined()
  expect(db.options.migrationsRun).not.toBeDefined()
})
