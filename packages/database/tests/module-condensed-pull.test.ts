import { container, endpoint, getSource } from '../src/data-source'
import { setup } from './setup'
import { remove } from '../src/sql'
import { ModuleCondensed } from '../src/entity'
import { ModuleCondensedRepository } from '../src/repository'

const lowerBound = 6000

const dbName = 'test_module_condensed_pull'
const db = getSource(dbName)

beforeAll(() => setup(dbName))

jest.setTimeout(10000)
test('moduleCondensed.pull', async () => {
  remove.tables(['moduleCondensed'])
  const pullOnEmpty = await container(db, () => ModuleCondensedRepository(db).pull())
  const pullOnFull = await container(db, () => ModuleCondensedRepository(db).pull())
  const written = await endpoint(db, 
    async () => await container(db, () => ModuleCondensedRepository(db).find())
  )

  expect([pullOnFull, pullOnEmpty, written]).toBeDefined()
  if (!pullOnFull || !pullOnEmpty || !written) {
    return
  }
  /* make sure every element is a valid ModuleCondensed */
  written.forEach((module) => {
    expect(module).toBeInstanceOf(ModuleCondensed)
  })
  const s = new Set(written)
  expect(s.size).toBe(written.length)
  expect(s.size).toBeGreaterThan(lowerBound)
  if (db.isInitialized) {
    await db.destroy()
  }
})
