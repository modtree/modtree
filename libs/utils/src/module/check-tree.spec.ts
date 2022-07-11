import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { checkTree } from './check-tree'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    // 1000 mods
    A1000: { prereqTree: '', fulfillRequirements: ['A2000', 'C2000', 'D2000'] },
    B1000: { prereqTree: '', fulfillRequirements: ['B2000', 'C2000', 'D2000'] },
    // 2000 mods
    A2000: { prereqTree: 'A1000' },
    B2000: { prereqTree: 'A1000' },
    C2000: { prereqTree: { and: ['A1000', 'B1000'] } },
    D2000: { prereqTree: { or: ['A1000', 'B1000'] } },
  },
}
const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))
const correct = [
  {
    type: 'module with no pre-requisites',
    query: 'A1000',
    done: [],
    expected: true,
  },
  {
    type: 'pre-reqs cleared',
    query: 'A2000',
    done: ['A1000'],
    expected: true,
  },
  {
    type: 'pre-reqs not cleared',
    query: 'A2000',
    done: ['B1000'],
    expected: false,
  },
]

test.each(correct)('$type', async ({ query, done, expected }) => {
  await moduleRepo.findByCode(query).then((module) => {
    expect(checkTree(module.prereqTree, done)).toBe(expected)
  })
})
