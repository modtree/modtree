import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    // 1000 mods
    AX1000: { prereqTree: '', fulfillRequirements: ['AX2000', 'CX2000'] },
    BX1000: { prereqTree: '', fulfillRequirements: ['BX2000'] },
    CX1000: { prereqTree: '', fulfillRequirements: ['CX2000'] },
    // 2000 mods
    AX2000: { prereqTree: 'AX1000', fulfillRequirements: ['AX3000'] },
    BX2000: { prereqTree: 'BX1000', fulfillRequirements: ['AX3000', 'BX3000'] },
    CX2000: {
      prereqTree: { or: ['AX1000', 'CX1000'] },
      fulfillRequirements: [],
    },
    // 3000 mods
    AX3000: {
      prereqTree: { or: ['AX2000', 'BX2000'] },
      fulfillRequirements: [],
    },
    BX3000: {
      prereqTree: { or: ['BX2000', 'CX2000'] },
      fulfillRequirements: [],
    },
    CX3000: { prereqTree: { or: ['CX2000'] }, fulfillRequirements: [] },
  },
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'it favors mods that unlock more',
    done: ['AX1000', 'BX1000', 'CX1000'],
    doing: ['CX2000'],
    required: [
      'AX1000',
      'AX2000',
      'AX3000',
      'BX1000',
      'BX2000',
      'BX3000',
      'CX1000',
      'CX2000',
      'CX3000',
    ],
    selected: ['CX2000'],
    expected: ['BX2000', 'AX2000'],
  },
  {
    type: 'it favors required modules',
    done: ['AX1000', 'BX1000', 'CX1000'],
    doing: ['CX2000'],
    required: [
      'AX1000',
      'AX2000',
      'AX3000',
      'BX1000',
      'BX3000',
      'CX1000',
      'CX2000',
      'CX3000',
    ],
    selected: ['CX2000'],
    expected: ['AX2000', 'BX2000'],
  },
  {
    type: "don't suggest done mods",
    done: ['AX1000', 'BX1000', 'CX1000', 'BX2000'],
    doing: ['CX2000'],
    required: [
      'AX1000',
      'AX2000',
      'AX3000',
      'BX1000',
      'BX3000',
      'CX1000',
      'CX2000',
      'CX3000',
    ],
    selected: ['CX2000'],
    expected: ['AX2000', 'AX3000', 'BX3000'],
  },
  {
    type: "don't suggest doing mods",
    done: ['AX1000', 'BX1000', 'CX1000'],
    doing: ['BX2000', 'CX2000'],
    required: [
      'AX1000',
      'AX2000',
      'AX3000',
      'BX1000',
      'BX3000',
      'CX1000',
      'CX2000',
      'CX3000',
    ],
    selected: ['CX2000'],
    expected: ['AX2000'],
  },
]

test.each(correct)('$type', async (props) => {
  const { done, doing, selected, required, expected } = props
  await moduleRepo
    .getSuggestedModules(done, doing, selected, required)
    .then((result) => expect(result).toStrictEqual(expected))
})
