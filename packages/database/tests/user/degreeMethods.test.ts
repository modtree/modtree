import { container, endpoint, getSource } from '../../src/data-source'
import { User, Degree } from '../../src/entity'
import { UserRepository } from '../../src/repository'
import { setup, importChecks, teardown } from '../environment'
import { setupUser } from './setup'

const dbName = 'test_user_degreeMethods'
const db = getSource(dbName)
let degree: Degree
let user: User

beforeAll(async () => {
  await setup(dbName)
  const res = await setupUser(db)
  if (!res) throw new Error('Unable to setup User.degreeMethods test.')
  ;[user, degree] = res
})
afterAll(() => teardown(dbName))

importChecks({
  entities: [User, Degree],
  repositories: [UserRepository(db)],
})

jest.setTimeout(20000)

describe('User.addDegree', () => {
  it('Successfully adds a degree to a user', async () => {
    await container(db, () => UserRepository(db).addDegree(user, degree.id))
    // get user with all relations
    const res = await endpoint(db, () =>
      container(db, () =>
        UserRepository(db).findOneById(user.id)
      )
    )
    expect(res).toBeDefined()
    if (!res)
      return
    user = res
    expect(user.savedDegrees).toBeInstanceOf(Array)
    expect(user.savedDegrees.length).toEqual(1)
    expect(user.savedDegrees[0].id).toEqual(degree.id)
  })
})
