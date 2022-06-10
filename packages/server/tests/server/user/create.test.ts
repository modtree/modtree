import { AxiosError } from 'axios'
import { User } from '@modtree/entity'
import { Delete, server, t, init } from '@modtree/test-env'

afterAll(() => Delete.User(t.userId))

/**
 * create a user
 */
test('It should create a user', async () => {
  await server.post('user/create', init.user2).then((res) => {
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
      ...init.user2,
      email: undefined,
    })
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})
