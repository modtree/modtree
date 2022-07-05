import { User, Graph } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

let saved: Graph
let unsaved: Graph

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    )
    .then(([user, deg]) => {
      t.degree = deg
      return Repo.User.insertDegrees(user, [deg.id])
    })
    .then((user) => {
      t.user = user
      return Promise.all([
        Repo.Graph.initialize({
          userId: user.id,
          degreeId: t.degree!.id,
          modulesPlacedCodes: [],
          modulesHiddenCodes: [],
          pullAll: true,
        }),
        Repo.Graph.initialize({
          userId: user.id,
          degreeId: t.degree!.id,
          modulesPlacedCodes: [],
          modulesHiddenCodes: [],
          pullAll: false,
        }),
      ])
    })
    .then(([graph1, graph2]) => {
      saved = graph1
      unsaved = graph2
      return Repo.User.insertGraphs(t.user!, [saved.id])
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

describe('Saved graph with saved degree', () => {
  beforeEach(expect.hasAssertions)

  it('returns a user', async () => {
    // get user with all relations
    await Repo.User.setMainGraph(t.user!, saved.id).then((user) => {
      expect(user).toBeInstanceOf(User)
      t.user = user
    })
  })

  it('sets correct main graph', () => {
    const graphId = t.user!.mainGraph!.id
    expect(graphId).toEqual(saved.id)
  })
})

describe('Unsaved graph with saved degree', () => {
  beforeEach(expect.hasAssertions)

  it('throws an error', async () => {
    await expect(() =>
      Repo.User.setMainGraph(t.user!, unsaved.id)
    ).rejects.toThrow(Error('Graph not in savedGraphs'))
  })
})
