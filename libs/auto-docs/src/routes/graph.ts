import { init } from '../init'
import { Route } from './index'

export const GraphRoutes: Route[] = [
  {
    route: '/graph',
    method: 'post',
    params: init.graph3,
  },
  {
    route: '/graph/:graphId',
    method: 'get',
  },
  {
    route: '/graph/:graphId',
    method: 'delete',
  },
  {
    route: '/graph/:graphId/flow',
    method: 'patch',
    params: {
      flowNodes: init.updatedNodes,
      flowEdges: init.edges,
    },
  },
  {
    route: '/graph/:graphId/node',
    method: 'patch',
    params: {
      flowNode: init.updatedNode,
    },
  },
  {
    route: '/graph/:graphId/suggest',
    method: 'post',
    params: {
      /**
       * needs to be in graph1
       */
      selectedCodes: ['CS1101S'],
    },
  },
  {
    route: '/graph/:graphId/toggle/:moduleCode',
    method: 'patch',
    /**
     * needs to be in graph1, and placed
     */
    url: '/graph/:graphId/toggle/CS1101S',
  },
  {
    route: '/graphs',
    method: 'get',
    params: {
      graphIds: [],
    },
  },
]
