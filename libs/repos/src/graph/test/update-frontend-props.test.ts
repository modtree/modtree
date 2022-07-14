import '@modtree/test-env/jest'
import { GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Graph, GraphFlowNode, Module } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const mod = (moduleCode: string): Module =>
  Object.assign(new Module(), { moduleCode })

const nod = (moduleCode: string, x: number, y: number): GraphFlowNode => ({
  id: moduleCode,
  position: { x, y },
  data: mod(moduleCode),
})

const fakeData = {
  user: [
    {
      id: 'user-1',
      modulesDone: [mod('MA2001')],
      modulesDoing: [mod('MA2219')],
    },
  ],
  degree: [{ id: 'degree-1', modules: [mod('MA2001'), mod('MA1100')] }],
}

const graphRepo = new GraphRepository(mocks.getDb(fakeData))

function expectNestedProp(received: any, prop: { [key: string]: any }) {
  expect(received).toEqual(
    expect.arrayContaining([expect.objectContaining(prop)])
  )
}

const correct = [
  {
    type: 'override the entire graph',
    userId: 'user-1',
    degreeId: 'degree-1',
    flowNodes: [nod('CM1102', 271, 608)],
    flowEdges: [],
    expected: [
      {
        id: 'CM1102',
        position: { x: 271, y: 608 },
      },
    ],
    error: '',
  },
  {
    type: 'FIXME: make a validity check',
    userId: 'user-1',
    degreeId: 'degree-1',
    flowNodes: [nod('NOT_VALID', 271, 608)],
    flowEdges: [],
    expected: [
      {
        id: 'NOT_VALID',
        position: { x: 271, y: 608 },
      },
    ],
    error: '',
  },
].map((e, i) => ({ ...e, index: i + 1 }))

test.each(correct)(
  '$type',
  async ({ userId, degreeId, expected, error, ...frontEndProps }) => {
    const graph = await graphRepo.initialize({
      title: 'test',
      userId,
      degreeId,
    })
    await graphRepo.updateFrontendProps(graph, frontEndProps).then((graph) => {
      expect(graph).toBeInstanceOf(Graph)
      const { flowNodes } = graph
      expect(flowNodes).toHaveLength(expected.length)
      expected.forEach((expected) => expectNestedProp(flowNodes, expected))
    })
  }
)
