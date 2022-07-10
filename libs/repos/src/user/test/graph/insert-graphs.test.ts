import { User } from '@modtree/types'
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
      return Repo.Graph.initialize({
        title: 'Test Graph',
        userId: user.id,
        degreeId: degree.id,
      })
    })
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

describe('insertGraphs', () => {
  beforeEach(expect.hasAssertions)

  it('returns a user', async () => {
    // get user with all relations
    await Repo.User.insertGraphs(t.user!, [t.graph!.id]).then((user) => {
      expect(user).toBeInstanceOf(User)
      t.user = user
    })
  })

  it('adds correct graph id', () => {
    const graphIds = t.user!.savedGraphs.map((g) => g.id)
    expect(graphIds).toContain(t.graph!.id)
  })
})
