import { Graph } from '@modtree/entity'
import { DegreeRepository } from '@modtree/repo-degree'
import { UserRepository } from '@modtree/repo-user'
import { init, Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { GraphFrontendProps } from '@modtree/types'
import { oneUp } from '@modtree/utils'

import { GraphRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ graph: Graph; moduleCodes: string[] }> = {}

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: new UserRepository(db),
        Degree: new DegreeRepository(db),
        Graph: new GraphRepository(db),
      })
      return Promise.all([
        Repo.User!.initialize(init.user1),
        Repo.Degree!.initialize(init.degree1),
      ])
    })
    .then(([user, degree]) =>
      Repo.Graph!.initialize({
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

async function updateFrontendProps(props: GraphFrontendProps): Promise<Graph> {
  return Repo.Graph!.updateFrontendProps(t.graph!, props).then((graph) => {
    t.graph! = graph
    return graph
  })
}

describe('shape check', () => {
  it('has prop: flowEdges', async () => {
    expect(t.graph!).toHaveProperty('flowEdges')
    const flowEdges = t.graph!.flowNodes
    expect(flowEdges).toBeInstanceOf(Array)
    expect(flowEdges).toHaveLength(0)
  })
  it('has prop: flowNodes', async () => {
    expect(t.graph!).toHaveProperty('flowNodes')
    const flowNodes = t.graph!.flowNodes
    expect(flowNodes).toBeInstanceOf(Array)
    expect(flowNodes).toHaveLength(0)
  })
})

describe('insert check', () => {
  it('inserts a flow node', async () => {
    expect.hasAssertions()
    await updateFrontendProps({
      flowNodes: [
        {
          moduleCode: 'CS1010S',
          position: {
            x: 420,
            y: 68,
          },
        },
      ],
      flowEdges: [],
    }).then(() => {
      expect(t.graph!.flowNodes).toHaveLength(1)
    })
  })
  it('inserts correct moduleCode', () => {
    const codes = t.graph!.flowNodes.map((node) => node.moduleCode)
    expect(codes).toContain('CS1010S')
  })
  it('inserts correct position', () => {
    const nodes = t.graph!.flowNodes
    const positions = nodes.map((n) => n.position)
    expect(positions).toContainEqual({ x: 420, y: 68 })
  })
})

describe('update check', () => {
  it('updates a flow node', async () => {
    expect.hasAssertions()
    await updateFrontendProps({
      flowNodes: [
        {
          moduleCode: 'CS1010S',
          position: {
            x: 300,
            y: -27,
          },
        },
      ],
      flowEdges: [],
    }).then(() => {
      expect(t.graph!.flowNodes).toHaveLength(1)
    })
  })
  it('updates correct flowNode', () => {
    const node = t.graph!.flowNodes.find(
      (node) => node.moduleCode === 'CS1010S'
    )
    expect(node!.position).toEqual({ x: 300, y: -27 })
  })
})
