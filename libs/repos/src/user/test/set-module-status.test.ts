import '@modtree/test-env/jest'
import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.db)

const correct = [
  {
    done: [],
    doing: [],
    codes: ['MA2001'],
    status: ModuleStatus.DONE,
    expectedDone: ['MA2001'],
    expectedDoing: [],
  },
  {
    done: ['MA1100'],
    doing: [],
    codes: ['MA1100', 'MA2001'],
    status: ModuleStatus.DOING,
    expectedDone: [],
    expectedDoing: ['MA1100', 'MA2001'],
  },
  {
    done: ['MA2001'],
    doing: ['MA1100'],
    codes: ['MA1100', 'MA2001'],
    status: ModuleStatus.NOT_TAKEN,
    expectedDone: [],
    expectedDoing: [],
  },
  {
    done: ['MA2001'],
    doing: ['MA1100'],
    codes: ['NOT_VALID'],
    status: ModuleStatus.NOT_TAKEN,
    expectedDone: ['MA2001'],
    expectedDoing: ['MA1100'],
  },
]

test.each(correct)('works', async (props) => {
  const { done, doing, codes, expectedDone, expectedDoing, status } = props
  const user = await userRepo.initialize({
    ...init,
    modulesDone: done,
    modulesDoing: doing,
  })
  await userRepo.setModuleStatus(user, codes, status).then((user) => {
    const { modulesDone, modulesDoing } = {
      modulesDone: user.modulesDone.map((m) => m.moduleCode),
      modulesDoing: user.modulesDoing.map((m) => m.moduleCode),
    }
    expect(modulesDone).toIncludeSameMembers(expectedDone)
    expect(modulesDoing).toIncludeSameMembers(expectedDoing)
  })
})
