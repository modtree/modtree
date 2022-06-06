import { AxiosError } from 'axios'
import { User } from '../../../src/entity'
import { server } from '../environment'
import Init from '../../init'
import { toBeUserResponse } from '../expect-extend'

beforeAll(() => {
  expect.extend({ toBeUserResponse })
})

const t: Partial<{ userId: string }> = {}

/**
 * create a user
 * the user should then appear in the list of all users
 */
test('It should create a user', async () => {
  await server.post('user/create', Init.user2).then((res) => {
    const user: User = res.data
    expect(typeof user.id).toBe('string')
    expect(user.id.length).toBeGreaterThan(0)
    t.userId = user.id
  })
})

/**
 * reject a user creation if has insufficient keys
 * with status 400: Bad Request
 */
test('It should reject a user creation on insufficient keys', async () => {
  await expect(() =>
    server.post('user/create', {
      ...Init.user2,
      email: undefined,
    })
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})

/**
 * delete created user
 * (teardown)
 */
test('It should delete created user', async () => {
  await server.delete(`user/delete/${t.userId}`).then((res) => {
    expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})
