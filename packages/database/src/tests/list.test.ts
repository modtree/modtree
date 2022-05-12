import { list } from '../list'

test('test list module codes', async () => {
  const moduleCodes = await list.moduleCode()
  console.log(moduleCodes)
  expect(moduleCodes.size).toEqual(6000)
})
