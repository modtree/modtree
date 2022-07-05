import { Degree, User } from '@modtree/types'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

let saved: Degree
let unsaved: Degree

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
        Repo.Degree.initialize(init.degree2),
      ])
    )
    .then(([user, deg1, deg2]) => {
      saved = deg1
      unsaved = deg2
      return Repo.User.insertDegrees(user, [saved.id])
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

describe('Saved degree', () => {
  beforeEach(expect.hasAssertions)

  it('returns a user', async () => {
    // get user with all relations
    await Repo.User.setMainDegree(t.user!, saved.id).then((user) => {
      expect(user).toBeInstanceOf(User)
      t.user = user
    })
  })

  it('sets correct main degree', () => {
    const degreeId = t.user!.mainDegree!.id
    expect(degreeId).toEqual(saved.id)
  })
})

describe('Unsaved degree', () => {
  beforeEach(expect.hasAssertions)

  it('throws an error', async () => {
    await expect(() =>
      Repo.User.setMainDegree(t.user!, unsaved.id)
    ).rejects.toThrow(Error('Degree not in savedDegrees'))
  })
})
