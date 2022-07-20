import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const userRepo = new UserRepository(mocks.db)

const correct = [
  {
    type: 'sets a new done',
    done: [],
    doing: [],
    codes: ['MA2001'],
    status: ModuleStatus.DONE,
    expectedDone: ['MA2001'],
    expectedDoing: [],
  },
  {
    type: 'removes from done',
    done: ['MA1100'],
    doing: [],
    codes: ['MA1100', 'MA2001'],
    status: ModuleStatus.DOING,
    expectedDone: [],
    expectedDoing: ['MA1100', 'MA2001'],
  },
  {
    type: 'remove everything',
    done: ['MA2001'],
    doing: ['MA1100'],
    codes: ['MA1100', 'MA2001'],
    status: ModuleStatus.NOT_TAKEN,
    expectedDone: [],
    expectedDoing: [],
  },
  {
    type: 'invalid code',
    done: ['MA2001'],
    doing: ['MA1100'],
    codes: ['NOT_VALID'],
    status: ModuleStatus.NOT_TAKEN,
    expectedDone: ['MA2001'],
    expectedDoing: ['MA1100'],
  },
  {
    type: 'set doing without mutating done',
    done: ['CM1102'],
    doing: [],
    codes: ['MA1100', 'MA2001'],
    status: ModuleStatus.DOING,
    expectedDone: ['CM1102'],
    expectedDoing: ['MA1100', 'MA2001'],
  },
]

test.each(correct)('$type', async (props) => {
  const { done, doing, codes, expectedDone, expectedDoing, status } = props
  const user = await userRepo
    .initialize('khang@modtree.com')
    .then((user) => userRepo.setModuleStatus(user, done, ModuleStatus.DONE))
    .then((user) => userRepo.setModuleStatus(user, doing, ModuleStatus.DOING))
  await userRepo.setModuleStatus(user, codes, status).then((user) => {
    const { modulesDone, modulesDoing } = {
      modulesDone: user.modulesDone.map((m) => m.moduleCode),
      modulesDoing: user.modulesDoing.map((m) => m.moduleCode),
    }
    expect(modulesDone).toIncludeSameMembers(expectedDone)
    expect(modulesDoing).toIncludeSameMembers(expectedDoing)
  })
})
