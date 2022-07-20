import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: [
    { moduleCode: 'AX1000', fulfillRequirements: ['AX2000'] },
    { moduleCode: 'BX1000', fulfillRequirements: ['BX2000'] },
    { moduleCode: 'AX2000', prereqTree: { or: ['AX1000', 'BX1000'] } },
  ],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'false if done',
    code: 'AX1000',
    done: ['AX1000'],
    doing: ['BX1000'],
    expected: false,
  },
  {
    type: 'false if doing',
    code: 'BX1000',
    done: ['AX1000'],
    doing: ['BX1000'],
    expected: false,
  },
  {
    type: 'false if pre-reqs not there',
    code: 'AX2000',
    done: [],
    doing: [],
    expected: false,
  },
  {
    type: 'true if pre-reqs are there',
    code: 'AX2000',
    done: ['AX1000'],
    doing: [],
    expected: true,
  },
]

test.each(correct)('$type', async ({ code, expected, done, doing }) => {
  const user = await userRepo
    .initialize('khang@modtree.com')
    .then((user) => userRepo.setModuleStatus(user, done, ModuleStatus.DONE))
    .then((user) => userRepo.setModuleStatus(user, doing, ModuleStatus.DOING))
  await expect(userRepo.canTakeModule(user, code)).resolves.toBe(expected)
})
