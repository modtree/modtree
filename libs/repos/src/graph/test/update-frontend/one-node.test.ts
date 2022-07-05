import { Graph } from '@modtree/types'
import { init, Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { GraphFlowNode } from '@modtree/types'
import { empty, oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ graph: Graph; moduleCodes: string[] }> = {}

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    )
    .then(([user, degree]) =>
      Repo.Graph.initialize({
        userId: user.id,
        degreeId: degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: true,
      })
    )
    .then((graph) =>
      Repo.Graph.updateFrontendProps(graph, {
        flowNodes: [
          {
            id: 'CS1010S',
            position: {
              x: 0,
              y: 0,
            },
            data: {
              ...empty.Module,
              moduleCode: 'CS1010S',
            },
          },
        ],
        flowEdges: [],
      })
    )
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

async function findGraph(id: string) {
  return Repo.Graph.findOneById(id)
}

async function updateFlowNode(node: GraphFlowNode) {
  return Repo.Graph.updateFlowNode(t.graph!, node)
}

it('initial node count', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    expect(graph.flowNodes).toHaveLength(1)
  })
})

it('returns a relationless graph', async () => {
  await updateFlowNode({
    id: 'CS1010S',
    position: {
      x: 100,
      y: 200,
    },
    data: {
      ...empty.Module,
      moduleCode: 'CS1010S',
    },
  }).then((graph) => {
    expect(graph).toHaveProperty('flowNodes')
    expect(graph).toHaveProperty('flowEdges')
    expect(graph).toHaveProperty('id')
  })
})

it('final node count', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    expect(graph.flowNodes).toHaveLength(1)
  })
})

it('updates correct position', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const positions = graph.flowNodes.map((n) => n.position)
    expect(positions).toContainEqual({ x: 100, y: 200 })
  })
})

it('throws error if node ID does not exist', async () => {
  expect(() =>
    updateFlowNode({
      id: 'not found',
      position: {
        x: 100,
        y: 200,
      },
      data: {
        ...empty.Module,
        moduleCode: 'not found',
      },
    })
  ).rejects.toThrowError(Error('Invalid flow node ID'))
})
