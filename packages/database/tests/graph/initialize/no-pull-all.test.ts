import { getSource } from '../../../src/data-source'
import { Graph } from '../../../src/entity'
import { copy, oneUp } from '../../../src/utils'
import { repo, setup, teardown } from '../../environment'
import Init from '../../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ graph: Graph }> = {}

beforeAll(() =>
  setup(db)
    .then((res) => copy(res, repo))
    .then(() =>
      Promise.all([
        repo.User.initialize(Init.user1),
        repo.Degree.initialize(Init.degree1),
      ])
    )
    .then(([user, degree]) =>
      repo.Graph.initialize({
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
