import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { teardown, Repo, t, setup, init } from '@modtree/test-env'
import { GraphFlowNode } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize({
          ...init.user1,
          modulesDone: ['MA2001'],
          modulesDoing: ['MA2219'],
        }),
        Repo.Degree.initialize({
          moduleCodes: ['CS1101S', 'MA2001'],
          title: 'Test Degree',
        }),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
      return Repo.Graph.initialize({
        title: 'Test Graph',
        userId: t.user!.id,
        degreeId: t.degree!.id,
      })
    })
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

// for future deeper testing
let nodes: GraphFlowNode[]
// let edges: GraphFlowEdge[]

test('has flow nodes', () => {
  const graphNodes = t.graph!.flowNodes
  expect(graphNodes).toBeInstanceOf(Array)
  expect(graphNodes.length).toBeGreaterThan(0)
  nodes = graphNodes
})

test('has flow edges', () => {
  const graphEdges = t.graph!.flowEdges
  expect(graphEdges).toBeInstanceOf(Array)
  expect(graphEdges.length).toBeGreaterThan(0)
  // edges = graphEdges
})

test('flow nodes are arranged', () => {
  // console.log(nodes)
  expect(nodes).toBeDefined()
})
