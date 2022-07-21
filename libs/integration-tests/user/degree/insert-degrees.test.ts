import { User } from '@modtree/types'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let originalUser: User
let returnedUser: User

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1.email),
        Repo.Degree.initialize(init.degree1.title, init.degree1.moduleCodes),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      originalUser = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

beforeEach(expect.hasAssertions)

it('returns a user', async () => {
  // get user with all relations
  await Repo.User.insertDegrees(t.user!, [t.degree!.id]).then((user) => {
    expect(user).toBeInstanceOf(User)
    returnedUser = user
  })
})

it('does not mutate the original user', () => {
  expect(originalUser).toStrictEqual(t.user)
  expect(originalUser).not.toEqual(returnedUser)
})

it('adds correct degree id', () => {
  const degreeIds = returnedUser.savedDegrees.map((d) => d.id)
  expect(degreeIds).toContain(t.degree!.id)
})

it('add same degree', async () => {
  // get user with all relations
  await Repo.User.insertDegrees(t.user!, [t.degree!.id]).then((user) => {
    expect(user).toBeInstanceOf(User)
    expect(user.savedDegrees).toHaveLength(1)
  })
})
