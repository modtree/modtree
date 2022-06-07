import { AxiosError } from 'axios'
import { Degree } from '../../../src/entity'
import { Delete, server, t } from '../environment'
import { init } from '../../init'
import { toBeUserResponse } from '../expect-extend'

beforeAll(() => {
  expect.extend({ toBeUserResponse })
})
afterAll(() => Delete.Degree(t.degreeId))

/**
 * create a degree
 */
test('It should create a degree', async () => {
  await server.post('degree/create', init.degree1).then((res) => {
    const degree: Degree = res.data
    expect(typeof degree.id).toBe('string')
    expect(degree.id.length).toBeGreaterThan(0)
    t.degreeId = degree.id
  })
})

/**
 * reject a degree creation if has insufficient keys
 * with status 400: Bad Request
 */
test('It should reject a degree creation on insufficient keys', async () => {
  await expect(() =>
    server.post('degree/create', {
      ...init.degree1,
      moduleCodes: undefined,
    })
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})
