import { AxiosError } from 'axios'
import { User } from '../../src/entity'

import { server, setup } from './environment'

beforeAll(setup)

const user1 = {
  displayName: 'Nguyen Vu Khang',
  username: 'nguyenvukhang',
  email: 'khang@modtree.com',
  modulesDone: [
    'MA2001,',
    'MA1100,',
    'HSH1000,',
    'HSA1000,',
    'GEA1000',
    'IS1103',
    'CS1010S',
    'DTK1234',
    'HS1401S',
    'HSI1000',
    'HSS1000',
    'MA2002',
    'MA2219',
    'PC1432',
  ],
  modulesDoing: [],
  matriculationYear: 2021,
  graduationYear: 2024,
  graduationSemester: 2,
}

const t: Partial<{ userId: string }> = {}

/**
 * create a user
 * the user should then appear in the list of all users
 */
test('It should create a user', async () => {
  expect.hasAssertions()
  await server.post('user/create', user1).then((res) => {
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
test('It should reject a user creation on invaid id', async () => {
  expect.hasAssertions()
  await expect(() =>
    server.post('user/create', {
      ...user1,
      email: undefined,
    })
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})

/**
 * list all users
 */
test('It should list all users', async () => {
  expect.hasAssertions()
  await server.get('user/list').then((res) => {
    const users: User[] = res.data
    users.forEach((user) => {
      expect(user).toBeUserResponse()
    })
    const ids = users.map((u) => u.id)
    expect(ids).toContain(t.userId)
  })
})

/**
 * delete created user
 */
test('It should delete created user', async () => {
  expect.hasAssertions()
  await server.delete(`user/delete/${t.userId}`).then((res) => {
    expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})

/**
 * reject user deletion if has invalid id
 * with status 404: User not found
 */
test('It should reject bad id for deletion', async () => {
  expect.hasAssertions()
  await expect(() => server.delete('user/delete/invalid')).rejects.toThrowError(
    new AxiosError('Request failed with status code 404')
  )
})
