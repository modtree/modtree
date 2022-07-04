import { init } from '../init'
import { Route } from './index'

export const DegreeRoutes: Route[] = [
  {
    route: '/degree',
    method: 'post',
    params: init.degree3,
  },
  {
    route: '/degree/:degreeId',
    method: 'get',
  },
  {
    route: '/degree/:degreeId',
    method: 'delete',
  },
  {
    route: '/degree/:degreeId',
    method: 'patch',
    params: {
      /**
       * needs to be NOT in degree1
       */
      moduleCodes: ['NM2207'],
    },
  },
  {
    route: '/degree/:degreeId/get-full',
    method: 'get',
  },
  {
    route: '/degrees',
    method: 'get',
    params: {
      degreeIds: [],
    },
  },
]
