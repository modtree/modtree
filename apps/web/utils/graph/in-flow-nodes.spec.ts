import { ApiResponse } from '@modtree/types'
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
      id: '',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        id: '',
        moduleCode: 'CS1010',
        title: '',
        prerequisite: '',
        corequisite: '',
        preclusion: '',
        fulfillRequirements: [],
        prereqTree: '',
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
