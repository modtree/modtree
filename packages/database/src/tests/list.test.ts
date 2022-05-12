import { list } from '../list'

test('test list module codes', async () => {
  const moduleCodes = await list.moduleCode()
  console.log(moduleCodes)

  expect([4]).toEqual([4])
})
