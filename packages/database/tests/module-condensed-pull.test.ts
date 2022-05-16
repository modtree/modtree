import { AppDataSource, container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { ModuleCondensed } from '../src/entity-repo/ModuleCondensed'
import { ModuleCondensedRepository } from '../src/repository/ModuleCondensed'
import { remove } from '../src/sql'

const lowerBound = 6000

beforeAll(async () => {
  await setup()
})

jest.setTimeout(10000)
test('moduleCondensed.pull', async () => {
  remove.tables(['moduleCondensed'])
  const pullOnEmpty = await container(() => ModuleCondensedRepository.pull())
  const pullOnFull = await container(() => ModuleCondensedRepository.pull())
  const written = await endpoint(
    async () => await container(() => ModuleCondensedRepository.find())
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
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
  }
})
