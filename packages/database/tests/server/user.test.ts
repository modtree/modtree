import { server } from './environment'
import { User } from '../../src/entity'
import { setup } from './environment'

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
  })
})

/**
 * create a user
 * the user should then appear in the list of all users
 */
test('It should list all users', async () => {
  expect.hasAssertions()
  await server.get('user/list').then((res) => {
    const users: User[] = res.data
    users.forEach((user) => {
      expect(user).toBeUserResponse()
    })
  })
})
