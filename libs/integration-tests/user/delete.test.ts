import { Degree } from '@modtree/types'
import { setup, teardown, Repo, t, api, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { EntityNotFoundError } from 'typeorm'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.user1.email))
    .then((user) => api.setupUser(user))
    .then((user) => {
      t.user = user
      t.degree = user.savedDegrees[0]
      t.graph = user.savedGraphs[0]
    })
)
afterAll(() => teardown(db))

it('user has 1 degree', async () => {
  await Repo.User.findOneById(t.user!.id).then((user) => {
    expect(user.savedDegrees).toHaveLength(1)
  })
})

it('successfully deletes user', async () => {
  await Repo.User.remove(t.user!).then((user) => {
    expect(user.id).toEqual(undefined)
  })
})

it('user does not exist', async () => {
  await expect(() => Repo.User.findOneById(t.user!.id)).rejects.toThrow(
    EntityNotFoundError
  )
})

it('degree exists', async () => {
  await Repo.Degree.findOneById(t.degree!.id).then((degree) => {
    expect(degree).toBeInstanceOf(Degree)
  })
})

it('graph does not exist', async () => {
  await expect(() => Repo.Graph.findOneById(t.graph!.id)).rejects.toThrow(
    EntityNotFoundError
  )
})
