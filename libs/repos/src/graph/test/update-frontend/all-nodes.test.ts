import { init, Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { Graph, ModuleCondensed, GraphFrontendProps } from '@modtree/types'
import { empty, oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ graph: Graph; moduleCodes: string[] }> = {}
let CS1010S: ModuleCondensed

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
        Repo.ModuleCondensed.findOneByOrFail({ moduleCode: 'CS1010S' }).then(
          (module) => {
            CS1010S = module
          }
        ),
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
    .then((graph) => {
      t.graph = graph
    })
)
afterAll(() => teardown(db))

async function findGraph(id: string) {
  return Repo.Graph.findOneById(id)
}

async function updateFrontendProps(props: GraphFrontendProps) {
  return Repo.Graph.updateFrontendProps(t.graph!, props)
}

it('returns a relationless graph', async () => {
  await updateFrontendProps({
    flowNodes: [
      {
        id: 'CS1010S',
        position: {
          x: 420,
          y: 68,
        },
        data: {
          ...empty.Module,
          moduleCode: 'CS1010S',
        },
      },
    ],
    flowEdges: [],
  }).then((graph) => {
    expect(graph).toHaveProperty('flowNodes')
    expect(graph).toHaveProperty('flowEdges')
    expect(graph).toHaveProperty('id')
  })
})

it('inserts a flow node', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    expect(graph.flowNodes).toHaveLength(1)
  })
})

it('inserts correct module', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const codes = graph.flowNodes.map((node) => node.id)
    expect(codes).toContain('CS1010S')
  })
})

it('inserts correct position', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const positions = graph.flowNodes.map((n) => n.position)
    expect(positions).toContainEqual({ x: 420, y: 68 })
  })
})

it('updates a flow node', async () => {
  await updateFrontendProps({
    flowNodes: [
      {
        id: 'CS1010S',
        position: {
          x: 300,
          y: -27,
        },
        data: {
          ...empty.Module,
          moduleCode: 'CS1010S',
        },
      },
    ],
    flowEdges: [],
  }).then((graph) => {
    expect(graph.flowNodes).toHaveLength(1)
  })
})

it('updates correct flow node', async () => {
  await findGraph(t.graph!.id).then((graph) => {
    const node = graph.flowNodes.find((node) => node.id === 'CS1010S')
    expect(node!.position).toEqual({ x: 300, y: -27 })
  })
})