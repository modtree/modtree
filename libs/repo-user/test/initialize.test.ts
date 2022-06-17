import { User } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.User = new UserRepository(db)
  })
)
afterAll(() => teardown(db))

it('initial count', async () => {
  await Repo.User!.count().then((count) => {
    expect(count).toEqual(0)
  })
})

it('returns a user', async () => {
  await Repo.User!.initialize(init.user1).then((user) => {
    expect(user).toBeInstanceOf(User)
    t.user = user
  })
})

it('increments the count by 1', async () => {
  await Repo.User!.count().then((count) => {
    expect(count).toEqual(1)
  })
})

it('creates new user even with same auth0 id', async () => {
  await Repo.User!.initialize(init.user1).then((user) => {
    expect(user.id).not.toEqual(t.user!.id)
    expect(user.authZeroId).toEqual(t.user!.authZeroId)
  })
})

it('increments the count by 1 again', async () => {
  await Repo.User!.count().then((count) => {
    // same as previous count
    expect(count).toEqual(2)
  })
})
