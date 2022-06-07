import { User } from '../../../src/entity'
import { Create, Delete, server, t } from '../environment'
import { init } from '../../init'
import { toBeUserResponse } from '../expect-extend'

beforeAll(async () => {
  expect.extend({ toBeUserResponse })
  return Promise.all([Create.User(init.user2), Create.User(init.user3)]).then(
    ([user1, user2]) => {
      t.userId1 = user1.id
      t.userId2 = user2.id
    }
  )
})
afterAll(() => Promise.all([Delete.User(t.userId1), Delete.User(t.userId2)]))

/**
 * list all users
 */
test('It should list all users', async () => {
  await server.get('user/list').then((res) => {
    const users: User[] = res.data
    users.forEach((user) => {
      expect(user).toBeUserResponse()
    })
    /**
     * flatten the ids
     */
    const ids = users.map((u) => u.id)
    /**
     * check that the list of all ids contains the two created ids
     */
    expect(ids).toEqual(expect.arrayContaining([t.userId1, t.userId2]))
  })
})
