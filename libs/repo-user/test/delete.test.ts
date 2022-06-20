import { Degree } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      return Promise.all([
        Repo.User!.initialize(init.user1),
        Repo.Degree!.initialize(init.degree1),
      ])
    })
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
      return Repo.User!.insertDegrees(t.user, [t.degree.id])
    })
    .then(() =>
      Repo.Graph!.initialize({
        userId: t.user!.id,
        degreeId: t.degree!.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: false,
      })
    )
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

it('user has 1 degree', async () => {
  await Repo.User!.findOneById(t.user!.id).then((user) => {
    expect(user.savedDegrees).toHaveLength(1)
  })
})

it('successfully deletes user', async () => {
  await Repo.User!.remove(t.user!).then((user) => {
    expect(user.id).toEqual(undefined)
  })
})

it('user does not exist', async () => {
  await expect(() => Repo.User!.findOneById(t.user!.id)).rejects.toThrow(Error)
})

it('degree exists', async () => {
  await Repo.Degree!.findOneById(t.degree!.id).then((degree) => {
    expect(degree).toBeInstanceOf(Degree)
  })
})

it('graph does not exist', async () => {
  await expect(() => Repo.Graph!.findOneById(t.graph!.id)).rejects.toThrow(
    Error
  )
})
