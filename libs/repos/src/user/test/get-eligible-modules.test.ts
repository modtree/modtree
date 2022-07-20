import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

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

const userRepo = new UserRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'no modules have requirements met',
    done: ['AX1000'],
    doing: [],
    expected: [],
  },
  {
    type: 'prereqTree or test',
    done: ['BX1000'],
    doing: [],
    expected: ['BX2000'],
  },
  {
    type: 'prereqTree and test',
    done: ['AX1000', 'AX2000'],
    doing: [],
    expected: ['CX2000'],
  },
  {
    type: 'modules doing are ignored',
    done: ['DX1000'],
    doing: ['AX1000', 'BX1000'], // don't take into account these
    expected: [],
  },
]

test.each(correct)('$type', async ({ done, doing, expected }) => {
  const user = await userRepo
    .initialize2('khang@modtree.com')
    .then((user) => userRepo.setModuleStatus(user, done, ModuleStatus.DONE))
    .then((user) => userRepo.setModuleStatus(user, doing, ModuleStatus.DOING))
  await userRepo.getEligibleModules(user).then((modules) => {
    const codes = modules.map((m) => m.moduleCode)
    expect(codes).toIncludeSameMembers(expected)
  })
})
