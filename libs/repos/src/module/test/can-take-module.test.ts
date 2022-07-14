import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    {
      moduleCode: 'MA2101',
      prereqTree: {
        or: ['MA2001', 'MA1508'],
      },
    },
    {
      moduleCode: 'MA1100',
      prereqTree: {
        or: ['MA1301', 'MA1301X'],
      },
    },
    {
      moduleCode: 'CS2040S',
      prereqTree: {
        and: [
          {
            or: ['MA1100', 'CS1231'],
          },
          'MA2001',
        ],
      },
    },
    {
      moduleCode: 'CS1010S',
      prereqTree: '',
    },
  ],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'pre-requisite fulfilled',
    done: ['MA2001'],
    doing: ['MA2219'],
    tested: 'MA2101',
    expected: true,
  },
  {
    type: 'pre-requisite not fulfilled',
    done: ['MA2001'],
    doing: ['MA2219'],
    tested: 'MA1100',
    expected: false,
  },
  {
    type: 'some pre-requisites fulfilled',
    done: ['MA2001'],
    doing: ['MA2219'],
    tested: 'CS2040S',
    expected: false,
  },
  {
    type: 'no pre-requisites',
    done: ['MA2001'],
    doing: ['MA2219'],
    tested: 'CS1010S',
    expected: true,
  },
  {
    type: 'already done',
    done: ['MA2001'],
    doing: [],
    tested: 'MA2001',
    expected: false,
  },
  {
    type: 'already doing',
    done: [],
    doing: ['MA2001'],
    tested: 'MA2001',
    expected: false,
  },
  {
    type: 'invalid code',
    done: ['CM1102'],
    doing: ['CS1010'],
    tested: 'NOT_VALID',
    expected: false,
  },
]

test.each(correct)('$type', async ({ done, doing, tested, expected }) => {
  const received = await moduleRepo.canTakeModule(done, doing, tested)
  expect(received).toBe(expected)
})
