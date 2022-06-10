import { Degree, User } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { UserRepository } from '../src'
import { DegreeRepository } from '@modtree/repo-degree'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: new UserRepository(db),
        Degree: new DegreeRepository(db),
      })
      return Promise.all([
        Repo.User!.initialize(init.user1),
        Repo.Degree!.initialize(init.degree1),
      ])
    })
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
      Repo.User!.addDegree(t.user!, t.degree!.id)
        .then(() => Repo.User!.findOneById(t.user!.id))
        .then((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.savedDegrees).toBeInstanceOf(Array)
          expect(user.savedDegrees.length).toEqual(1)
          expect(user.savedDegrees[0].id).toEqual(t.degree!.id)
          t.user = user
        })
    )
  })
})

describe('User.findDegree', () => {
  it('Successfully finds a saved degree of a user', async () => {
    expect.assertions(2)
    await container(db, () =>
      Repo.User!.findDegree(t.user!, t.degree!.id).then((degree) => {
        expect(degree).toBeInstanceOf(Degree)
        expect(degree.id).toEqual(t.degree!.id)
      })
    )
  })

  it('Throws error if degree not found', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        Repo.User!.findDegree(t.user!, init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})

describe('User.removeDegree', () => {
  it('Successfully removes a saved degree', async () => {
    await container(db, () => Repo.User!.removeDegree(t.user!, t.degree!.id))
    expect(t.user!.savedDegrees).toBeInstanceOf(Array)
    expect(t.user!.savedDegrees.length).toEqual(0)
  })

  it('Throws error if degree not found', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        Repo.User!.removeDegree(t.user!, init.invalidUUID)
      ).rejects.toThrowError(Error('Degree not found in User'))
    )
  })
})
