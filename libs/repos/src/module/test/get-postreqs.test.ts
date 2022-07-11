import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { Module } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const fakeData: Record<string, Partial<Module>> = {
  ABC1000: { fulfillRequirements: ['shared1', 'shared2', 'ABC1000_only'] },
  XYZ1000: { fulfillRequirements: ['shared1', 'shared2', 'XYZ1000_only'] },
  DAB1000: { fulfillRequirements: [] },
}
const moduleRepo = new ModuleRepository(mocks.db, fakeData)
const correct = [
  {
    query: ['ABC1000'],
    expected: ['shared1', 'shared2', 'ABC1000_only'],
  },
  {
    query: ['XYZ1000'],
    expected: ['shared1', 'shared2', 'XYZ1000_only'],
  },
  {
    query: ['ABC1000', 'XYZ1000'],
    expected: ['shared1', 'shared2', 'ABC1000_only', 'XYZ1000_only'],
  },
  {
    query: ['DAB1000'],
    expected: [],
  },
]

test.each(correct)(
  'post-reqs of $query are correct',
  async ({ query, expected }) => {
    const res = await moduleRepo.getPostReqs(query)
    expect(res).toIncludeSameMembers(expected)
  }
)
