import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    {
      moduleCode: 'ABC1000',
      fulfillRequirements: ['shared1', 'shared2', 'ABC1000_only'],
    },
    {
      moduleCode: 'XYZ1000',
      fulfillRequirements: ['shared1', 'shared2', 'XYZ1000_only'],
    },
    { moduleCode: 'DAB1000', fulfillRequirements: [] },
  ],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))
const correct = [
  {
    type: 'returns fulfillRequirements for 1 module',
    query: ['ABC1000'],
    expected: ['shared1', 'shared2', 'ABC1000_only'],
  },
  {
    type: 'returns union of fulfillRequirements for multiple modules',
    query: ['ABC1000', 'XYZ1000'],
    expected: ['shared1', 'shared2', 'ABC1000_only', 'XYZ1000_only'],
  },
  {
    type: 'handles empty fulfillRequirements',
    query: ['DAB1000'],
    expected: [],
  },
]

test.each(correct)('$type', async ({ query, expected }) => {
  const res = await moduleRepo.getPostReqs(query)
  expect(res).toIncludeSameMembers(expected)
})
