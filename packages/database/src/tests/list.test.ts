import { list } from '../list'
import { fetch } from '../nusmods'
import { setup } from '../../tests/setup'
import { endpoint } from '../data-source'

beforeAll(async () => {
  await setup()
})

test('test list module codes', async () => {
  const latest = await fetch.moduleCondensed()
  const moduleCodes = await endpoint(list.moduleCode)
  expect(moduleCodes).not.toBeUndefined()
  expect(moduleCodes).not.toBeNull()
  if (!moduleCodes) {
    return
  }
  expect(moduleCodes.size).toEqual(latest.total)
})
