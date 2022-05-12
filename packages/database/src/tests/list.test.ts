import { list } from '../list'
import { fetch } from '../nusmods'

test('test list module codes', async () => {
  const latest = await fetch.moduleCondensed()
  const moduleCodes = await list.moduleCode()
  expect(moduleCodes.size).toEqual(latest.total)
})
