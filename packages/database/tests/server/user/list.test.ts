import { User } from '../../../src/entity'
import { Mockup, server } from '../environment'
import Init from '../../init'
import { toBeUserResponse } from '../expect-extend'

const t: Partial<{ userId1: string; userId2: string }> = {}

beforeAll(async () => {
  expect.extend({ toBeUserResponse })
  return Promise.all([Mockup.User(Init.user2), Mockup.User(Init.user3)]).then(
    ([user1, user2]) => {
      t.userId1 = user1.id
      t.userId2 = user2.id
    }
  )
})

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

/**
 * delete created users
 * (teardown)
 */
test('It should delete created users', async () => {
  await Promise.all([
    server.delete(`user/delete/${t.userId1}`),
    server.delete(`user/delete/${t.userId2}`),
  ]).then(([res1, res2]) => {
    expect(res1.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
    expect(res2.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})
