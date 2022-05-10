// import { AppDataSource, db } from '../src/data-source'
// import { Module } from '../src/entity'
import { listModuleCodes } from '../src/modules'
import { fetch, write } from '../src/nusmods'

test('fetch all condensed modules from nusmods api', async () => {
  const { total, indexed, unique } = await fetch.moduleCondensed()
  expect(total).toEqual(indexed)
  expect(unique).toEqual([4])
})

test('pull all condensed modules into database', async () => {
  const { modules } = await fetch.moduleCondensed()
  await write.moduleCondensed(modules)
  const indexedModuleCodes: Set<string> = await listModuleCodes()
  expect(Array.from(indexedModuleCodes).length).toEqual(6186)
})
