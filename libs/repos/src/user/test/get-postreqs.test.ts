import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    { moduleCode: 'AX1000', fulfillRequirements: ['AX2000', 'CX2000'] },
    { moduleCode: 'AX2000', fulfillRequirements: [] },
    { moduleCode: 'BX1000', fulfillRequirements: ['BX2000', 'CX2000'] },
    { moduleCode: 'DX1000', fulfillRequirements: [] },
  ],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'works with one module done',
    done: ['AX1000'],
    doing: [],
    expected: ['AX2000', 'CX2000'],
  },
  {
    type: 'returns union for multiple mods done',
    done: ['AX1000', 'BX1000'],
    doing: [],
    expected: ['AX2000', 'BX2000', 'CX2000'],
  },
  {
    type: 'blank fulfillRequirements',
    done: ['DX1000'],
    doing: ['AX1000', 'BX1000'],
    expected: [],
  },
  {
    type: "doesn't show already done",
    done: ['AX1000', 'AX2000'],
    doing: [],
    expected: ['CX2000'],
  },
  {
    type: "doesn't show already doing",
    done: ['AX1000'],
    doing: ['AX2000'],
    expected: ['CX2000'],
  },
]

test.each(correct)('$type', async ({ done, doing, expected }) => {
  const user = await userRepo
    .initialize('khang@modtree.com')
    .then((user) => userRepo.setModuleStatus(user, done, ModuleStatus.DONE))
    .then((user) => userRepo.setModuleStatus(user, doing, ModuleStatus.DOING))
  await userRepo.getPostReqs(user).then((modules) => {
    const codes = modules.map((m) => m.moduleCode)
    expect(codes).toIncludeSameMembers(expected)
  })
})
