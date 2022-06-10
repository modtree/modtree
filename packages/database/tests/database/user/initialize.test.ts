import { container, getSource } from '@src/data-source'
import { User } from '@modtree/entity'
import { setup, teardown, Repo, t } from '@environment'
import { init } from '@tests/init'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
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
