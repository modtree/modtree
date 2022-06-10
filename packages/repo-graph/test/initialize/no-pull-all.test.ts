import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { getUserRepository } from '@modtree/repo-user'
import { getDegreeRepository } from '@modtree/repo-degree'
import { getGraphRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: getUserRepository(db),
        Degree: getDegreeRepository(db),
        Graph: getGraphRepository(db),
      })
      return Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    })
    .then(([user, degree]) =>
      Repo.Graph.initialize({
        userId: user.id,
        degreeId: degree.id,
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

describe('Graph.initialize', () => {
  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(t.graph.modulesPlaced).toHaveLength(0)
    expect(t.graph.modulesHidden).toHaveLength(0)
  })
})
