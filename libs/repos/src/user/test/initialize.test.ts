import { ModuleRepository, UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Module, User } from '@modtree/types'
import { flatten } from '@modtree/utils'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module', () => {
  const actual = jest.requireActual('../../module')
  const M: typeof ModuleRepository = actual.ModuleRepository
  M.prototype.findByCodes = jest.fn(async (codes: string[]) => {
    return codes.map((code) =>
      Object.assign(new Module(), { moduleCode: code })
    )
  })
  return { ModuleRepository: M }
})

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  displayName: 'Nguyen Vu Khang',
  username: 'nguyenvukhang',
  email: 'khang@modtree.com',
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2219'],
  matriculationYear: 2021,
  graduationYear: 2025,
  graduationSemester: 2,
}

const userRepo = new UserRepository(mocks.db)
let user: User

it('returns a user', async () => {
  await userRepo.initialize(init).then((res) => {
    expect(res).toBeInstanceOf(User)
    user = res
  })
})

it('has correct modules', () => {
  const [done, doing] = [
    user.modulesDone.map(flatten.module),
    user.modulesDoing.map(flatten.module),
  ]
  expect(done).toIncludeSameMembers(init.modulesDone)
  expect(doing).toIncludeSameMembers(init.modulesDoing)
})

it('preserves primitive data', () => {
  const correct = [
    [user.authZeroId, init.authZeroId],
    [user.displayName, init.displayName],
    [user.username, init.username],
    [user.email, init.email],
    [user.matriculationYear, init.matriculationYear],
    [user.graduationYear, init.graduationYear],
    [user.graduationSemester, init.graduationSemester],
  ]
  correct.forEach(([received, expected]) => expect(received).toEqual(expected))
})
