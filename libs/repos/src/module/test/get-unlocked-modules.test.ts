import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    // 1000 mods
    {
      moduleCode: 'AX1000',
      prereqTree: '',
      fulfillRequirements: ['AX2000', 'CX2000'],
    },
    { moduleCode: 'BX1000', prereqTree: '', fulfillRequirements: ['BX2000'] },
    { moduleCode: 'CX1000', prereqTree: '', fulfillRequirements: ['CX2000'] },
    // 2000 mods
    {
      moduleCode: 'CX2000',
      prereqTree: { or: ['AX1000', 'CX1000'] },
      fulfillRequirements: [],
    },
    {
      moduleCode: 'AX2000',
      prereqTree: 'AX1000',
      fulfillRequirements: ['AX3000'],
    },
    {
      moduleCode: 'BX2000',
      prereqTree: 'BX1000',
      fulfillRequirements: ['AX3000'],
    },
    // 3000 mods
    { moduleCode: 'AX3000', prereqTree: { or: ['AX2000', 'BX2000'] } },
  ],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))
moduleRepo.getUnlockedModules

const correct = [
  {
    type: 'unlocks one',
    done: ['AX1000'],
    doing: [],
    query: 'AX2000',
    expected: ['AX3000'],
  },
  {
    type: "don't show if already done",
    done: ['CX1000', 'CX2000'],
    doing: [],
    query: 'AX1000', // fulfills requirements for CX2000
    expected: ['AX2000'], // but not CX2000, since it's done
  },
  {
    type: "don't show if already unlocked",
    done: ['AX1000', 'AX2000'],
    doing: [],
    query: 'BX2000', // fulfills requirements for AX2000
    expected: [], // AX3000 is already unlocked by AX2000
  },
]

test.each(correct)('$type', async ({ done, doing, query, expected }) => {
  await moduleRepo.getUnlockedModules(done, doing, query).then((result) => {
    expect(result).toIncludeSameMembers(expected)
  })
})
