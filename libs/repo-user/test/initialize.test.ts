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
beforeEach(() => {
  expect.hasAssertions()
})

describe('User.initialize', () => {
  it('initial count', async () => {
    await Repo.User!.count().then((count) => {
      expect(count).toEqual(expect.any(Number))
      t.count = count
    })
  })

  it('returns a user', async () => {
    await Repo.User!.initialize(init.user1).then((user) => {
      expect(user).toBeInstanceOf(User)
    })
  })

  it('increments the count by 1', async () => {
    await Repo.User!.count().then((count) => {
      expect(count).toEqual(t.count! + 1)
    })
  })
})
