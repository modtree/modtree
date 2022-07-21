import { ApiResponse } from '@modtree/types'
import { getUniqueGraphTitle } from '.'

const graph: ApiResponse.Graph = {
  id: '',
  user: '',
  modulesHidden: [],
  modulesPlaced: [],
  flowEdges: [],
  flowNodes: [],
  title: 'my graph',
  degree: {
    id: '',
    title: 'my degree',
  },
}

test('it works', () => {
  expect(getUniqueGraphTitle(graph)).toEqual('my-degree/my-graph')
})
