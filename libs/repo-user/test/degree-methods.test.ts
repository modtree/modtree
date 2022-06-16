import { Degree, User } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { UserRepository } from '../src'
import { DegreeRepository } from '@modtree/repo-degree'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      Repo.Degree = new DegreeRepository(db)
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
  beforeEach(expect.hasAssertions)

  it('returns a user', async () => {
    // get user with all relations
    await Repo.User!.addDegree(t.user!, t.degree!.id).then((user) => {
      expect(user).toBeInstanceOf(User)
      t.user = user
    })
  })

  it('adds correct degree id', () => {
    const degreeIds = t.user!.savedDegrees.map((d) => d.id)
    expect(degreeIds).toContain(t.degree!.id)
  })
})

describe('User.findDegree', () => {
  beforeEach(expect.hasAssertions)

  it('returns a degree', async () => {
    await Repo.User!.findDegree(t.user!, t.degree!.id).then((degree) => {
      expect(degree).toBeInstanceOf(Degree)
    })
  })

  it('finds correct degree id', async () => {
    await Repo.User!.findDegree(t.user!, t.degree!.id).then((degree) => {
      expect(degree.id).toBe(t.degree!.id)
    })
  })

  it('rejects if degree not found', async () => {
    await expect(() =>
      Repo.User!.findDegree(t.user!, 'NOT_VALID')
    ).rejects.toThrowError(Error('Degree not found in User'))
  })
})

describe('User.removeDegree', () => {
  beforeEach(expect.hasAssertions)

  it('returns a user', async () => {
    await Repo.User!.removeDegree(t.user!, t.degree!.id).then((user) => {
      expect(user).toBeInstanceOf(User)
      t.user = user
    })
  })

  it('removes a degree', () => {
    expect(t.user!.savedDegrees).toHaveLength(0)
  })

  it('rejects if degree not found', async () => {
    await expect(() =>
      Repo.User!.removeDegree(t.user!, 'NOT_VALID')
    ).rejects.toThrowError(Error('Degree not found in User'))
  })
})
