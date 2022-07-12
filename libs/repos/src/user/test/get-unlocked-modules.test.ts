import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    AX1000: { fulfillRequirements: ['AX2000', 'CX2000'] },
    BX1000: { fulfillRequirements: ['BX2000', 'CX2000'] },
    DX1000: { fulfillRequirements: [] },
    AX2000: {
      prereqTree: { and: ['AX1000', 'BX1000'] },
      fulfillRequirements: ['CX2000'],
    },
    BX2000: { prereqTree: { or: ['AX1000', 'BX1000'] } },
    CX2000: { prereqTree: { and: ['AX1000', 'AX2000'] } },
  },
}

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.getDb(fakeData))

const correct = [
  {
    done: [],
    doing: [],
    code: 'AX1000',
    expected: [],
  },
  {
    done: ['BX1000', 'BX2000'],
    doing: [],
    code: 'AX1000',
    expected: ['AX2000'], // doesn't have BX2000 because already done
  },
  {
    done: ['BX1000', 'BX2000'],
    doing: ['AX2000'],
    code: 'AX1000',
    expected: [], // AX2000 is already doing
  },
]

test.each(correct)(
  'works with $done done',
  async ({ done, doing, code, expected }) => {
    const user = await userRepo.initialize({
      ...init,
      modulesDone: done,
      modulesDoing: doing,
    })
    await userRepo.getUnlockedModules(user, code).then((modules) => {
      const codes = modules.map((m) => m.moduleCode)
      expect(codes).toIncludeSameMembers(expected)
    })
  }
)
