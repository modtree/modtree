import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    // 1000 mods
    AX1000: { fulfillRequirements: ['AX2000', 'CX2000', 'DX2000'] },
    BX1000: { fulfillRequirements: ['BX2000', 'CX2000', 'DX2000'] },
    // 2000 mods
    AX2000: { prereqTree: 'AX1000' },
    BX2000: { prereqTree: 'BX1000' },
    CX2000: { prereqTree: { and: ['AX1000', 'BX1000'] } },
    DX2000: { prereqTree: { or: ['AX1000', 'BX1000'] } },
  },
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

const correct = [
  {
    done: ['AX1000'],
    doing: [],
    selected: [],
    expected: ['AX2000', 'DX2000'],
  },
  {
    done: [],
    doing: ['AX1000', 'BX1000'],
    selected: [],
    expected: [],
  },
  {
    done: ['AX1000', 'BX1000'],
    doing: [],
    selected: [],
    expected: ['AX2000', 'BX2000', 'CX2000', 'DX2000'],
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
