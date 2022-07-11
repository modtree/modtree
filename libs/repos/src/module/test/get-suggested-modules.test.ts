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
    A2000: { prereqTree: 'A1000', fulfillRequirements: ['A3000'] },
    B2000: { prereqTree: 'B1000', fulfillRequirements: ['A3000', 'B3000'] },
    C2000: { prereqTree: { or: ['A1000', 'C1000'] }, fulfillRequirements: [] },
    // 3000 mods
    A3000: { prereqTree: { or: ['A2000', 'B2000'] } },
    B3000: { prereqTree: { or: ['B2000', 'C2000'] } },
    C3000: { prereqTree: { or: ['C2000'] } },
  },
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))
moduleRepo.getUnlockedModules

const correct = [
  {
    type: 'it works',
    done: ['A1000', 'B1000', 'C1000'],
    doing: ['C2000'],
    required: [
      'A1000',
      'A2000',
      'A3000',
      'B1000',
      'B2000',
      'B3000',
      'C1000',
      'C2000',
      'C3000',
    ],
    selected: ['C2000'],
    expected: ['B2000', 'A2000'],
  },
]

test.each(correct)('$type', async (props) => {
  const { done, doing, selected, required, expected } = props
  await moduleRepo
    .getSuggestedModules(done, doing, selected, required)
    .then((result) => expect(result).toStrictEqual(expected))
})
