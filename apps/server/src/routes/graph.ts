import { body, param } from 'express-validator'
import { GraphController } from '../controller'
import { Route } from './types'
import { validModuleCode } from '@modtree/utils'

export const graphRoutes: Route<GraphController>[] = [
  {
    action: 'create',
    route: '/graphs/create',
    method: 'post',
    validators: [],
  },
  {
    action: 'get',
    route: '/graphs/get/:graphId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/graphs/delete/:graphId',
    method: 'delete',
    validators: [],
  },
  {
    action: 'list',
    route: '/graphs/list',
    method: 'get',
    validators: [],
  },
  {
    action: 'toggle',
    route: '/graphs/id/:graphId/toggle/:moduleCode',
    method: 'post',
    validators: [
      param('moduleCode')
        .custom(validModuleCode)
        .withMessage('must be a valid module code'),
    ],
  },
  {
    action: 'updateFrontendProps',
    route: '/graphs/update-frontend/:graphId',
    method: 'post',
    validators: [body('flowNodes').isArray(), body('flowEdges').isArray()],
  },
]
