import { container, getSource } from '../../src/data-source'
import { User, Degree } from '../../src/entity'
import { UserRepository } from '../../src/repository'
import { setup, teardown } from '../environment'
import Mockup from '../mockup'
import Init from '../init'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{
  user: User
  degree: Degree
}> = {}

beforeAll(() =>
  setup(dbName)
    .then(() => Mockup.user(db, Init.user1, Init.degree1))
    .then((res) => {
      t.user = res.user
      t.degree = res.degree
    })
)
afterAll(() => db.destroy().then(() => teardown(dbName)))

describe('User.addDegree', () => {
  it('Successfully adds a degree to a user', async () => {
    expect.assertions(4)
    await container(db, () =>
      // get user with all relations
      UserRepository(db)
        .addDegree(t.user, t.degree.id)
        .then(() => UserRepository(db).findOneById(t.user.id))
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
      UserRepository(db)
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
        UserRepository(db).findDegree(t.user, Init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})

describe('User.removeDegree', () => {
  it('Successfully removes a saved degree', async () => {
    await container(db, () =>
      UserRepository(db).removeDegree(t.user, t.degree.id)
    )
    expect(t.user.savedDegrees).toBeInstanceOf(Array)
    expect(t.user.savedDegrees.length).toEqual(0)
  })

  it('Throws error if degree not found', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        UserRepository(db).removeDegree(t.user, Init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})
