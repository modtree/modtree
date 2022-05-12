import { analyze } from '../api/analyze'
import { list } from '../list'
import { fetch } from '../nusmods'

test('test list module codes', async () => {
  const latest = await fetch.moduleCondensed()
  const moduleCodes = await analyze(list.moduleCode)
  expect(moduleCodes.size).toEqual(latest.total)
})
