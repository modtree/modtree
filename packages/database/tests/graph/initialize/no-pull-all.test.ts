import { container, getSource } from '../../../src/data-source'
import { Degree, Graph, User } from '../../../src/entity'
import { GraphRepository } from '../../../src/repository'
import { oneUp } from '../../../src/utils'
import { setup, teardown } from '../../environment'
import Mockup from '../../mockup'
import Init from '../../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const t: Partial<{ user: User; degree: Degree; graph: Graph }> = {}

beforeAll(() =>
  setup(db)
    .then(() => Mockup.user(db, Init.user1))
    .then((user) => {
      t.user = user
    })
    .then(() => Mockup.degree(db, Init.degree1))
    .then((degree) => {
      t.degree = degree
    })
    .then(() =>
      Mockup.graph(db, {
        userId: t.user.id,
        degreeId: t.degree.id,
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
  it('Initializes a graph', async () => {
    expect.assertions(1)
    /**
     * initialize a test graph instance
     */
    await container(db, () =>
      GraphRepository(db)
        .initialize({
          userId: t.user.id,
          degreeId: t.degree.id,
          modulesPlacedCodes: [],
          modulesHiddenCodes: [],
          pullAll: false,
        })
        .then((res) => {
          expect(res).toBeInstanceOf(Graph)
          t.graph = res
        })
    )
  })
  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(t.graph.modulesPlaced).toHaveLength(0)
    expect(t.graph.modulesHidden).toHaveLength(0)
  })
})
