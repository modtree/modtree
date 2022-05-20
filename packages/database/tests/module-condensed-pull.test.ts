import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { remove } from '../src/sql'
import { ModuleCondensed } from '../src/entity'
import { ModuleCondensedRepository } from '../src/repository'
import { db } from '../src/config'

const lowerBound = 6000

beforeAll(setup)

jest.setTimeout(10000)
test('moduleCondensed.pull', async () => {
  remove.tables(['moduleCondensed'])
  const pullOnEmpty = await container(db, () => ModuleCondensedRepository.pull())
  const pullOnFull = await container(db, () => ModuleCondensedRepository.pull())
  const written = await endpoint(
    async () => await container(db, () => ModuleCondensedRepository.find())
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
