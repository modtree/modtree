import { DegreeController } from '../controller'
import { Route } from './types'

export const degreeRoutes: Route<DegreeController>[] = [
  {
    action: 'create',
    route: '/degrees/create',
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
    route: '/degrees/delete/:degreeId',
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
