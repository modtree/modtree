import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { Module } from '@modtree/types'

const database: Record<string, Partial<Module>> = {
  ABC1000: { fulfillRequirements: ['shared1', 'shared2', 'ABC1000_only'] },
  XYZ1000: { fulfillRequirements: ['shared1', 'shared2', 'XYZ1000_only'] },
  DAB1000: { fulfillRequirements: [] },
}

jest.mock('../../base')
jest.mock('../repo', () => {
  const M = jest.requireActual('../repo')
  const R: typeof ModuleRepository = M.ModuleRepository
  R.prototype.findByCodes = async (codes: string[]) => {
    return codes.map((code) => Object.assign(new Module(), database[code]))
  }
  return { ModuleRepository: R }
})

const moduleRepo = new ModuleRepository(mocks.db, database)

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
