import '@modtree/test-env/jest'
import { UserRepository, ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('../../base')
jest.mock('../../module', () => {
  const A = jest.requireActual('../../module/__mocks__')
  const M = A.ModuleRepository as any
  const spy = jest.spyOn(M.prototype, 'getUnlockedModules')
  M.spy = spy
  return {
    __esModule: true,
    ...A,
    ModuleRepository: M,
  }
})

const fakeData = {
  module: [
    { moduleCode: 'AX1000', fulfillRequirements: ['AX2000', 'CX2000'] },
    { moduleCode: 'BX1000', fulfillRequirements: ['BX2000', 'CX2000'] },
    { moduleCode: 'DX1000', fulfillRequirements: [] },
    {
      moduleCode: 'AX2000',
      prereqTree: { and: ['AX1000', 'BX1000'] },
      fulfillRequirements: ['CX2000'],
    },
    { moduleCode: 'BX2000', prereqTree: { or: ['AX1000', 'BX1000'] } },
    { moduleCode: 'CX2000', prereqTree: { and: ['AX1000', 'AX2000'] } },
  ],
}

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'no module requirements met',
    done: [],
    doing: [],
    code: 'AX1000',
    expected: [],
  },
  {
    type: "don't show modules already done",
    done: ['BX1000', 'BX2000'],
    doing: [],
    code: 'AX1000',
    expected: ['AX2000'],
  },
  {
    type: "don't show modules already doing",
    done: ['BX1000', 'BX2000'],
    doing: ['AX2000'],
    code: 'AX1000',
    expected: [],
  },
]

beforeEach(() => jest.clearAllMocks())

test.each(correct)('$type', async ({ done, doing, code, expected }) => {
  const user = await userRepo.initialize({
    ...init,
    modulesDone: done,
    modulesDoing: doing,
  })
  await userRepo.getUnlockedModules(user, code).then((modules) => {
    const codes = modules.map((m) => m.moduleCode)
    expect(codes).toIncludeSameMembers(expected)
    const m = ModuleRepository as any
    const spy = m.spy as jest.Mock
    const calls = spy.mock.calls[0]
    expect(calls[0]).toIncludeSameMembers(done)
    expect(calls[1]).toIncludeSameMembers(doing)
    expect(calls[2]).toEqual(code)
  })
})
