import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    // 1000 mods
    A1000: { fulfillRequirements: ['A2000', 'C2000', 'D2000'] },
    B1000: { fulfillRequirements: ['B2000', 'C2000', 'D2000'] },
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
    done: ['A1000'],
    doing: [],
    selected: [],
    expected: ['A2000', 'D2000'],
  },
  {
    done: [],
    doing: ['A1000', 'B1000'],
    selected: [],
    expected: [],
  },
  {
    done: ['A1000', 'B1000'],
    doing: [],
    selected: [],
    expected: ['A2000', 'B2000', 'C2000', 'D2000'],
  },
]

test.each(correct)(
  `done: $done
    doing: $doing
    selected: $selected`,
  async ({ done, doing, selected, expected }) => {
    const received = await moduleRepo.getEligibleModules(done, doing, selected)
    expect(received).toIncludeSameMembers(expected)
  }
)
