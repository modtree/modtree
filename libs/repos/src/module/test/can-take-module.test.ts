import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    MA2101: {
      moduleCode: 'MA2101',
      prereqTree: {
        or: ['MA1101R', 'MA2001', 'MA1506', 'MA1508', 'MA1508E', 'MA1513'],
      },
    },
    MA1100: {
      moduleCode: 'MA1100',
      prereqTree: {
        or: ['MA1301', 'MA1301X'],
      },
    },
    CS2040S: {
      moduleCode: 'CS2040S',
      prereqTree: {
        and: [
          {
            or: ['MA1100', 'CS1231'],
          },
          'CS1010',
        ],
      },
    },
    CS1010S: {
      moduleCode: 'CS1010S',
      prereqTree: '',
    },
  },
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

const correct = [
  { done: ['MA2001'], doing: ['MA2219'], tested: 'MA2101', expected: true },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'MA1100', expected: false },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'CS2040S', expected: false },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'CS1010S', expected: true },
  { done: ['MA2001'], doing: [], tested: 'MA2001', expected: false },
  { done: [], doing: ['MA2001'], tested: 'MA2001', expected: false },
  { done: ['CM1102'], doing: ['CS1010'], tested: 'NOT_VALID', expected: false },
]

test.each(correct)(
  `test: $tested, expect: $expected
    done: $done
    doing: $doing`,
  async ({ done, doing, tested, expected }) => {
    const received = await moduleRepo.canTakeModule(done, doing, tested)
    expect(received).toBe(expected)
  }
)
