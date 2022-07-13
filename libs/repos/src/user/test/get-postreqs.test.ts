import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    { moduleCode: 'AX1000', fulfillRequirements: ['AX2000', 'CX2000'] },
    { moduleCode: 'BX1000', fulfillRequirements: ['BX2000', 'CX2000'] },
    { moduleCode: 'DX1000', fulfillRequirements: [] },
  ],
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
    expected: [],
  },
  {
    done: ['AX1000'],
    doing: [],
    expected: ['AX2000', 'CX2000'],
  },
  {
    done: ['BX1000'],
    doing: [],
    expected: ['BX2000', 'CX2000'],
  },
  {
    done: ['AX1000', 'BX1000'],
    doing: [],
    expected: ['AX2000', 'BX2000', 'CX2000'],
  },
  {
    done: ['DX1000'],
    doing: ['AX1000', 'BX1000'], // don't take into account these
    expected: [],
  },
]

test.each(correct)(
  'works with $done done',
  async ({ done, doing, expected }) => {
    const user = await userRepo.initialize({
      ...init,
      modulesDone: done,
      modulesDoing: doing,
    })
    await userRepo.getPostReqs(user).then((modules) => {
      const codes = modules.map((m) => m.moduleCode)
      expect(codes).toIncludeSameMembers(expected)
    })
  }
)
