import { container, endpoint, getSource } from '../../../src/data-source'
import { Degree, Graph, Module, User } from '../../../src/entity'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../../../src/repository'
import { importChecks, setup, teardown } from '../../environment'
import { setupGraph } from '../setup'

const dbName = 'test_graph_initialize_no_pull_all'
const db = getSource(dbName)
let degree: Degree
let user: User
let graph: Graph

importChecks({
  entities: [Module, Degree, User, Graph],
  repositories: [UserRepository(db), DegreeRepository(db), GraphRepository(db)],
})

beforeAll(() =>
  setup(dbName)
    .then(() => setupGraph(db))
    .then((res) => {
      user = res.user
      degree = res.degree
    })
    .catch(() => {
      throw new Error('Unable to setup Graph test.')
    })
)
afterAll(() => teardown(dbName))

describe('Graph.initialize', () => {
  it('Initializes a graph', async () => {
    expect.assertions(1)
    /**
     * initialize a test graph instance
     */
    await endpoint(db, () =>
      container(db, () =>
        GraphRepository(db)
          .initialize({
            userId: user.id,
            degreeId: degree.id,
            modulesPlacedCodes: [],
            modulesHiddenCodes: [],
            pullAll: false,
          })
          .then((res) => {
            expect(res).toBeInstanceOf(Graph)
            graph = res
          })
      )
    )
  })
  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(graph.modulesPlaced.length).toEqual(0)
    expect(graph.modulesHidden.length).toEqual(0)
  })
})
