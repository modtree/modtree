import { analyze } from '../api/analyze'
import { config } from '../config'
import { list } from '../list'
import { fetch } from '../nusmods'
import { wipe } from '../sql'

beforeAll(async () => {
  await wipe.database(config.database, config.restoreSource)
})

test('test list module codes', async () => {
  const latest = await fetch.moduleCondensed()
  const moduleCodes = await analyze(list.moduleCode)
  expect(moduleCodes.size).toEqual(latest.total)
})
