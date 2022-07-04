import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { teardown, Repo, t, setup } from '@modtree/test-env'
import { graphInitializeSetup } from './setup'
import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(graphInitializeSetup)
    .then(() =>
      Repo.Graph.initialize({
        userId: t.user!.id,
        degreeId: t.degree!.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: true,
      }).then((graph) => {
        t.graph = graph
      })
    )
)
afterAll(() => teardown(db))

let nodes: GraphFlowNode[]
let edges: GraphFlowEdge[]

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
  edges = graphEdges
})
