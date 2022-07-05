import { User } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

beforeEach(expect.hasAssertions)

it('returns a user', async () => {
  // get user with all relations
  await Repo.User.insertDegrees(t.user!, [t.degree!.id]).then((user) => {
    expect(user).toBeInstanceOf(User)
    t.user = user
  })
})

it('adds correct degree id', () => {
  const degreeIds = t.user!.savedDegrees.map((d) => d.id)
  expect(degreeIds).toContain(t.degree!.id)
})
