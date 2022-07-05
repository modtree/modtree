import { Degree } from '@modtree/entity'
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

it('returns a degree', async () => {
  await Repo.User.findDegree(t.user!, t.degree!.id).then((degree) => {
    expect(degree).toBeInstanceOf(Degree)
  })
})

it('finds correct degree id', async () => {
  await Repo.User.findDegree(t.user!, t.degree!.id).then((degree) => {
    expect(degree.id).toBe(t.degree!.id)
  })
})

it('errors if degree not found', async () => {
  await expect(() =>
    Repo.User.findDegree(t.user!, 'NOT_VALID')
  ).rejects.toThrowError(Error('Degree not found in User'))
})
