import { getSource } from '../../../src/data-source'
import { oneUp } from '../../../src/utils'
import { setup, teardown, Repo, t } from '../../environment'
import Init from '../../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(Init.user1),
        Repo.Degree.initialize(Init.degree1),
      ])
    )
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
