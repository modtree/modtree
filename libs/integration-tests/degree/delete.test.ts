import { User } from '@modtree/types'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      return Promise.all([
        Repo.User.initialize(init.user1.email),
        Repo.Degree.initialize(init.degree1.title, init.degree1.moduleCodes),
      ])
    })
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
      return Repo.User.insertDegrees(t.user, [t.degree.id])
    })
    .then(() => Repo.Graph.initialize('Test Graph', t.user!.id, t.degree!.id))
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

it('user has 1 degree', async () => {
  await Repo.User.findOneById(t.user!.id).then((user) => {
    expect(user.savedDegrees).toHaveLength(1)
  })
})

it('successfully deletes degree', async () => {
  await Repo.Degree.remove(t.degree!).then((degree) => {
    expect(degree.id).toEqual(undefined)
  })
})

it('degree does not exist', async () => {
  await expect(() => Repo.Degree.findOneById(t.degree!.id)).rejects.toThrow(
    Error
  )
})

it('user exists', async () => {
  await Repo.User.findOneById(t.user!.id).then((user) => {
    expect(user).toBeInstanceOf(User)
  })
})

it('user has 0 degrees', async () => {
  await Repo.User.findOneById(t.user!.id).then((user) => {
    expect(user.savedDegrees).toHaveLength(0)
  })
})

it('graph does not exist', async () => {
  await expect(() => Repo.Graph.findOneById(t.graph!.id)).rejects.toThrow(Error)
})
