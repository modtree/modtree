import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    // 1000 mods
    A1000: { prereqTree: '', fulfillRequirements: ['A2000', 'C2000'] },
    B1000: { prereqTree: '', fulfillRequirements: ['B2000'] },
    C1000: { prereqTree: '', fulfillRequirements: ['C2000'] },
    // 2000 mods
    C2000: { prereqTree: { or: ['A1000', 'C1000'] }, fulfillRequirements: [] },
    A2000: { prereqTree: 'A1000', fulfillRequirements: ['A3000'] },
    B2000: { prereqTree: 'B1000', fulfillRequirements: ['A3000'] },
    // 3000 mods
    A3000: { prereqTree: { or: ['A2000', 'B2000'] } },
  },
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))
moduleRepo.getUnlockedModules

const correct = [
  {
    type: 'unlocks one',
    done: ['A1000'],
    doing: [],
    query: 'A2000',
    expected: ['A3000'],
  },
  {
    type: "don't show if already done",
    done: ['C1000', 'C2000'],
    doing: [],
    query: 'A1000', // fulfills requirements for C2000
    expected: ['A2000'], // but not C2000, since it's done
  },
  {
    type: "don't show if already unlocked",
    done: ['A1000', 'A2000'],
    doing: [],
    query: 'B2000', // fulfills requirements for A2000
    expected: [], // A3000 is already unlocked by A2000
  },
]

test.each(correct)('$type', async ({ done, doing, query, expected }) => {
  await moduleRepo.getUnlockedModules(done, doing, query).then((result) => {
    expect(result).toIncludeSameMembers(expected)
  })
})
