import { User } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db).then(() => {
  Repo.User = new UserRepository(db)
}))
afterAll(() => teardown(db))

const props = init.user1

describe('User.initialize', () => {
  it('Saves an empty user', async () => {
    expect.assertions(1)
    await container(db, () =>
      Repo.User.initialize(props).then((res) => {
        expect(res).toBeInstanceOf(User)
        t.user = res
      })
    )
  })

  it('Can find same user (with relations)', async () => {
    expect.assertions(2)
    await container(db, () =>
      Repo.User.findOneByUsername(props.username).then((res) => {
        expect(res).toBeInstanceOf(User)
        expect(res).toStrictEqual(t.user)
      })
    )
  })
})
