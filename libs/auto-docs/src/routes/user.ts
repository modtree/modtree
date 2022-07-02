import { ModuleStatus } from '@modtree/types'
import { init } from '../init'
import { Route } from './index'

export const UserRoutes: Route[] = [
  {
    route: '/user',
    method: 'post',
    params: init.user3,
  },
  {
    route: '/user/:authZeroId/login',
    method: 'post',
  },
  {
    route: '/user/:userId',
    method: 'get',
  },
  {
    route: '/user/:userId',
    method: 'delete',
  },
  {
    route: '/user/:userId/degree',
    method: 'patch',
    params: {
      degreeIds: [],
    },
  },
  {
    route: '/user/:userId/get-full',
    method: 'get',
  },
  {
    route: '/user/:userId/graph',
    method: 'patch',
    params: {
      graphIds: [],
    },
  },
  {
    route: '/user/:userId/main-degree',
    method: 'patch',
    params: {
      degreeId: '',
    },
  },
  {
    route: '/user/:userId/main-graph',
    method: 'patch',
    params: {
      graphId: '',
    },
  },
  {
    route: '/user/:userId/module',
    method: 'patch',
    params: {
      /**
       * needs to not be in user1
       */
      moduleCodes: ['AC5001'],
      status: ModuleStatus.DONE,
    },
  },
  {
    route: '/users',
    method: 'get',
  },
]
