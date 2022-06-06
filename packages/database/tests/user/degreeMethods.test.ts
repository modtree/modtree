import { container, getSource } from '../../src/data-source'
import { Degree, User } from '../../src/entity'
import { getDegreeRepository, getUserRepository } from '../../src/repository'
import { oneUp } from '../../src/utils'
import { setup, teardown } from '../environment'
import Init from '../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User; degree: Degree }> = {}

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        getUserRepository(db).initialize(Init.user1),
        getDegreeRepository(db).initialize(Init.degree1),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

describe('User.addDegree', () => {
  it('Successfully adds a degree to a user', async () => {
    expect.assertions(4)
    await container(db, () =>
      // get user with all relations
      getUserRepository(db)
        .addDegree(t.user, t.degree.id)
        .then(() => getUserRepository(db).findOneById(t.user.id))
        .then((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.savedDegrees).toBeInstanceOf(Array)
          expect(user.savedDegrees.length).toEqual(1)
          expect(user.savedDegrees[0].id).toEqual(t.degree.id)
          t.user = user
        })
    )
  })
})

describe('User.findDegree', () => {
  it('Successfully finds a saved degree of a user', async () => {
    expect.assertions(2)
    await container(db, () =>
      getUserRepository(db)
        .findDegree(t.user, t.degree.id)
        .then((degree) => {
          expect(degree).toBeInstanceOf(Degree)
          expect(degree.id).toEqual(t.degree.id)
        })
    )
  })

  it('Throws error if degree not found', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        getUserRepository(db).findDegree(t.user, Init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})

describe('User.removeDegree', () => {
  it('Successfully removes a saved degree', async () => {
    await container(db, () =>
      getUserRepository(db).removeDegree(t.user, t.degree.id)
    )
    expect(t.user.savedDegrees).toBeInstanceOf(Array)
    expect(t.user.savedDegrees.length).toEqual(0)
  })

  it('Throws error if degree not found', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        getUserRepository(db).removeDegree(t.user, Init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})
