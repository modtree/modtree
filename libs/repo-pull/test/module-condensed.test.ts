import { setup, teardown, Repo } from '@modtree/test-env'
import { ModuleCondensed } from '@modtree/types'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleCondensedRepository } from '../src/ModuleCondensed'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let moduleCondensedRepo: any
let pullOnEmpty: ModuleCondensed[]
let pullOnFull: ModuleCondensed[]
let written: ModuleCondensed[]

beforeAll(() =>
  setup(db).then(() => {
    moduleCondensedRepo = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

test('gather data', async () => {
  await Repo.ModuleCondensed.deleteAll()
  pullOnEmpty = await moduleCondensedRepo.pull()
  pullOnFull = await moduleCondensedRepo.pull()
  written = await moduleCondensedRepo.find()

  expect([pullOnFull, pullOnEmpty, written]).toBeDefined()
})

test('empty pull gets > 6000 modules', () => {
  expect(pullOnEmpty.length).toBeGreaterThan(6000)
  expect(pullOnEmpty).toBeArrayOf(ModuleCondensed)
})

test('all modules have distinct codes', async () => {
  const s = new Set(written)
  expect(s.size).toBe(written.length)
  expect(s.size).toBeGreaterThan(6000)
})
