import { UserRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { User } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

const userRepo = new UserRepository(mocks.db)
let user: User

it('returns a user', async () => {
  await userRepo.initialize('khang@modtree.com').then((res) => {
    expect(res).toBeInstanceOf(User)
    user = res
  })
})

it('correct email', () => {
  expect(user.email).toEqual('khang@modtree.com')
})
