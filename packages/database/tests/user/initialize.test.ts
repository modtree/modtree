import { container, getSource } from '../../src/data-source'
import { User } from '../../src/entity'
import { UserRepository } from '../../src/repository'
import Init from '../init'
import { setup, teardown } from '../environment'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const props = Init.user1

describe('User.initialize', () => {
  it('Saves an empty user', async () => {
    expect.assertions(1)
    await container(db, () =>
      UserRepository(db)
        .initialize(props)
        .then((res) => {
          expect(res).toBeInstanceOf(User)
          t.user = res
        })
    )
  })
  it('Can find same user (without relations)', async () => {
    expect.assertions(2)
    await container(db, () =>
      UserRepository(db)
        .findOneByUsername(props.username)
        .then((res) => {
          expect(res).toBeInstanceOf(User)
          expect(res).toStrictEqual(t.user)
        })
    )
  })
})
