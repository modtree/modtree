import { ModuleRepository } from '@modtree/repo-module'
import { empty } from '@modtree/utils'
import '@modtree/test-env/jest'
import { mocks } from '@modtree/test-env'

const moduleRepo = new ModuleRepository(mocks.db)

moduleRepo.find = async () => [
  {
    ...empty.Module,
    moduleCode: 'yes',
  },
  {
    ...empty.Module,
    moduleCode: 'no',
  },
]

test('base', async () => {
  expect(1).toBe(1)
  await moduleRepo.getCodes().then((res) => {
    console.log(res)
    expect(res).toHaveLength(2)
    expect(res).toIncludeSameMembers(['yes', 'no'])
    console.log(res.length)
  })
})
