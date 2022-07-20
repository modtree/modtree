import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { ModuleStatus, User } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const done = ['MA2001']
const doing = ['MA2219']

const userRepo = new UserRepository(mocks.db)
let user: User

beforeAll(async () => {
  user = await userRepo
    .initialize2('khang@modtree.com')
    .then((user) => userRepo.setModuleStatus(user, done, ModuleStatus.DONE))
    .then((user) => userRepo.setModuleStatus(user, doing, ModuleStatus.DOING))
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
