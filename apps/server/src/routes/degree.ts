import { DegreeController } from '../controller'
import { Route } from './types'

export const degreeRoutes: Route<DegreeController>[] = [
  {
    action: 'create',
    route: '/degrees/',
    method: 'post',
    validators: [],
  },
  {
    action: 'get',
    route: '/degrees/get/:degreeId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/degrees/:degreeId',
    method: 'delete',
    validators: [],
  },
  {
    action: 'list',
    route: '/degrees/',
    method: 'get',
    validators: [],
  },
]
