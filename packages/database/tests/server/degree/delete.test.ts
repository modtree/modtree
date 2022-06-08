import { AxiosError } from 'axios'
import { init } from '@tests/init'
import { Create, server, t } from '@environment'

beforeAll(() =>
  /**
   * note that this mockup contains its own checks too
   * apart from just calling the server endpoint
   */
  Create.Degree(init.degree1).then((degree) => {
    t.degreeId = degree.id
  })
)

/**
 * delete created degree
 */
test('It should delete created degree', async () => {
  await server.delete(`degree/delete/${t.degreeId}`).then((res) => {
    expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})

/**
 * reject degree deletion if has invalid id
 * with status 404: User not found
 */
test('It should reject bad id for deletion', async () => {
  await expect(() =>
    server.delete('degree/delete/invalid')
  ).rejects.toThrowError(new AxiosError('Request failed with status code 404'))
})
