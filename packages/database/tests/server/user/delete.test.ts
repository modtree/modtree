import { AxiosError } from 'axios'
import { init } from '../../init'
import { Create, server, t } from '../environment'

beforeAll(() =>
  /**
   * note that this mockup contains its own checks too
   * apart from just calling the server endpoint
   */
  Create.User(init.user2).then((user) => {
    t.userId = user.id
  })
)

/**
 * delete created user
 */
test('It should delete created user', async () => {
  await server.delete(`user/delete/${t.userId}`).then((res) => {
    expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})

/**
 * reject user deletion if has invalid id
 * with status 404: User not found
 */
test('It should reject bad id for deletion', async () => {
  await expect(() => server.delete('user/delete/invalid')).rejects.toThrowError(
    new AxiosError('Request failed with status code 404')
  )
})
