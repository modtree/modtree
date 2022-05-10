// import { AppDataSource, db } from '../src/data-source'
// import { Module } from '../src/entity'
import { listModuleCodes } from '../src/modules'
import { fetch, write } from '../src/nusmods'

test('fetch all condensed modules from nusmods api', async () => {
  const { total, indexed, unique, modules } = await fetch.moduleCondensed()
  await write.moduleCondensed(modules)

  // successful indexing of every module
  expect(indexed).toEqual(total)

  // modules only have 4-digit level codes
  expect(unique).toEqual([4])
})

test('list modules in database', async () => {
  const indexedModuleCodes: Set<string> = await listModuleCodes()
  const count = indexedModuleCodes.size
  expect(count).toEqual(6187)
})
