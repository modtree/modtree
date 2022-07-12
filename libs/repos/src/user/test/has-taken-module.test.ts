import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { User } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2219'],
}

const userRepo = new UserRepository(mocks.db)
let user: User

beforeAll(async () => {
  user = await userRepo.initialize(init)
})

const correct = [
  { type: 'true for done', code: 'MA2001', expected: true },
  { type: 'true for doing', code: 'MA2219', expected: true },
  { type: 'false otherwise', code: 'AC1000', expected: false },
  { type: 'false otherwise', code: 'CM1102', expected: false },
  { type: 'false with invalid', code: 'NOT_VALID', expected: false },
]

test.each(correct)('$type', async ({ code, expected }) => {
  await expect(userRepo.hasTakenModule(user, code)).resolves.toBe(expected)
})
