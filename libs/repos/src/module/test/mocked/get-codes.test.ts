import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../../base')
jest.mock('../../../module')

const fakeData = {
  module: [
    { moduleCode: 'CS1010' },
    { moduleCode: 'CS2100' },
    { moduleCode: 'MA2001' },
    { moduleCode: 'MA2002' },
  ],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

it('returns all codes', async () => {
  const moduleCodes = fakeData.module.map((m) => m.moduleCode)
  const res = await moduleRepo.getCodes()
  expect(moduleCodes).toIncludeSameMembers(res)
})
