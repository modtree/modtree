import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'
import { User } from '@modtree/entity'
import { IUserRepository } from '@modtree/types'
import { UserRepository } from '@modtree/repo-user'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let api: Api
let initializedUser: User
let userRepo: IUserRepository
let retrievedUser: User

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    userRepo = new UserRepository(db)
  })
)
afterAll(() => teardown(db))

async function init(authZeroId: string, email: string) {
  return api.userLogin(authZeroId, email)
}

it('returns a user', async () => {
  await init('auth0|laskdfjlasdjflk', 'khang@modtree.nus').then((u) => {
    expect(u).toBeInstanceOf(User)
    initializedUser = u
  })
})

it('user id exists in database', async () => {
  await userRepo.findOneByAuthZeroId(initializedUser.authZeroId).then((u) => {
    expect(u.id).toStrictEqual(initializedUser.id)
    retrievedUser = u
  })
})

it('user has one degree', () => {
  expect(initializedUser.savedDegrees).toHaveLength(1)
  expect(retrievedUser.savedDegrees).toHaveLength(1)
})

it('degree id is correct', () => {
  const received = retrievedUser.savedDegrees[0].id
  const expected = initializedUser.savedDegrees[0].id
  expect(received).toEqual(expected)
})

it('user has one graph', () => {
  expect(initializedUser.savedGraphs).toHaveLength(1)
  expect(retrievedUser.savedGraphs).toHaveLength(1)
})

it('graph id is correct', () => {
  const received = retrievedUser.savedGraphs[0].id
  const expected = initializedUser.savedGraphs[0].id
  expect(received).toEqual(expected)
})
