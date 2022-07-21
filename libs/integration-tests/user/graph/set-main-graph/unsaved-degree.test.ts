import { Graph } from '@modtree/types'
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
        Repo.User.initialize(init.user1.email),
        Repo.Degree.initialize(init.degree1.title, init.degree1.moduleCodes),
      ])
    )
    .then(([user, deg]) => {
      t.user = user
      t.degree = deg
      return Promise.all([
        Repo.Graph.initialize('Pull All', user.id, t.degree!.id),
        Repo.Graph.initialize('Empty', user.id, t.degree!.id),
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

describe('Saved graph with unsaved degree', () => {
  beforeEach(expect.hasAssertions)

  it('throws an error', async () => {
    await expect(() =>
      Repo.User.setMainGraph(t.user!, saved.id)
    ).rejects.toThrow(Error("Graph's degree not in savedDegrees"))
  })
})

describe('Unsaved graph with unsaved degree', () => {
  beforeEach(expect.hasAssertions)

  it('throws an error', async () => {
    await expect(() =>
      Repo.User.setMainGraph(t.user!, unsaved.id)
    ).rejects.toThrow(Error('Graph not in savedGraphs'))
  })
})
