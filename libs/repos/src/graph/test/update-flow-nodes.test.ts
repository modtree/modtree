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
    type: 'move an existing flow node',
    userId: 'user-1',
    degreeId: 'degree-1',
    node: nod('MA2219', 271, 608),
    expected: [
      {
        id: 'MA2219',
        position: { x: 271, y: 608 },
      },
    ],
  },
  {
    type: 'inserting new module fails',
    userId: 'user-1',
    degreeId: 'degree-1',
    node: nod('CM1102', 271, 608),
    expected: [],
    error: 'Invalid flow node ID',
  },
].map((e, i) => ({ ...e, index: i + 1 }))

test.each(correct)(
  '$type',
  async ({ userId, degreeId, node, expected, error }) => {
    const graph = await graphRepo.initialize({
      title: 'test',
      userId,
      degreeId,
    })
    if (!error) {
      await graphRepo.updateFlowNode(graph, node).then((graph) => {
        expect(graph).toBeInstanceOf(Graph)
        const { flowNodes } = graph
        expected.forEach((expected) => expectNestedProp(flowNodes, expected))
      })
    } else {
      await expect(graphRepo.updateFlowNode(graph, node)).rejects.toThrowError(
        error
      )
    }
  }
)
