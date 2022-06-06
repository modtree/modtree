import { getSource } from '../../../src/data-source'
import { Graph } from '../../../src/entity'
import {
  getDegreeRepository,
  getGraphRepository,
  getUserRepository,
} from '../../../src/repository'
import { oneUp } from '../../../src/utils'
import { setup, teardown } from '../../environment'
import Init from '../../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const t: Partial<{ graph: Graph }> = {}

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        getUserRepository(db).initialize(Init.user1),
        getDegreeRepository(db).initialize(Init.degree1),
      ])
    )
    .then(([user, degree]) =>
      getGraphRepository(db).initialize({
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
