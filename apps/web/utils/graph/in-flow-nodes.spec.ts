import { ApiResponse, empty } from '@modtree/types'
import { inFlowNodes } from '.'

const graph: ApiResponse.Graph = {
  id: '',
  user: '',
  modulesHidden: [],
  modulesPlaced: [],
  flowEdges: [],
  flowNodes: [
    /** fake flowNode */
    {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS1010',
      },
    },
  ],
  title: '',
  degree: {
    id: '',
    title: '',
  },
}

test('it works', () => {
  expect(inFlowNodes(graph, 'CS1010')).toEqual(true)
  expect(inFlowNodes(graph, 'MA2001')).toEqual(false)
})
