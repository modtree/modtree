import { setup, teardown, Repo } from '@modtree/test-env'
import { ModuleCondensed } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { ModuleCondensedRepository } from '@modtree/repo-module'

const lowerBound = 6000

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

jest.setTimeout(10000)
test('moduleCondensed.pull', async () => {
  await container(db, () => Repo.ModuleCondensed!.deleteAll())
  const pullOnEmpty = await container(db, () => Repo.ModuleCondensed!.pull())
  const pullOnFull = await container(db, () => Repo.ModuleCondensed!.pull())
  const written = await container(db, () => Repo.ModuleCondensed!.find())

  expect([pullOnFull, pullOnEmpty, written]).toBeDefined()
  if (!pullOnFull || !pullOnEmpty || !written) return
  /* make sure every element is a valid ModuleCondensed */
  expect(pullOnEmpty.length).toBeGreaterThan(lowerBound)
  written.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  const s = new Set(written)
  expect(s.size).toBe(written.length)
  expect(s.size).toBeGreaterThan(lowerBound)
})