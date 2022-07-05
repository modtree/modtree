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
      t.degree = degree
      return Repo.User.insertDegrees(user, [t.degree!.id])
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

beforeEach(expect.hasAssertions)

it('returns a user', async () => {
  await Repo.User.removeDegree(t.user!, t.degree!.id).then((user) => {
    expect(user).toBeInstanceOf(User)
    t.user = user
  })
})

it('removes a degree', () => {
  expect(t.user!.savedDegrees).toHaveLength(0)
})

it('errors if degree not found', async () => {
  await expect(() =>
    Repo.User.removeDegree(t.user!, 'NOT_VALID')
  ).rejects.toThrowError(Error('Degree not found in User'))
})
