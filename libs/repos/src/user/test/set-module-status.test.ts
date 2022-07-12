import '@modtree/test-env/jest'

import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const fakeData = {
  module: {
    AX1000: { fulfillRequirements: ['AX2000'] },
    BX1000: { fulfillRequirements: ['BX2000'] },
    AX2000: { prereqTree: { or: ['AX1000', 'BX1000'] } },
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
    codes: ['MA2001'],
    status: ModuleStatus.DONE,
    expectedDone: ['MA2001'],
    expectedDoing: [],
  },
]

test.each(correct)('yes', async (props) => {
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
