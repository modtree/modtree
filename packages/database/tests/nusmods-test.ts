import { fetch } from '../src/nusmods'

test('fetch all condensed modules from nusmods api', async () => {
  const { total, indexed, unique } = await fetch.moduleCondensed()
  expect(total).toEqual(indexed)
  expect(unique).toEqual([4])
})
