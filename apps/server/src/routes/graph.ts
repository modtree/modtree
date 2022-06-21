import { body, param } from 'express-validator'
import { GraphController } from '../controller'
import { Route } from './types'
import { validModuleCode } from '@modtree/utils'

export const graphRoutes: Route<GraphController>[] = [
  {
    action: 'create',
    route: '/graphs/',
    method: 'post',
    validators: [],
  },
  {
    action: 'get',
    route: '/graphs/:graphId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/graphs/:graphId',
    method: 'delete',
    validators: [],
  },
  {
    action: 'list',
    route: '/graphs/',
    method: 'get',
    validators: [],
  },
  {
    action: 'toggle',
    route: '/graphs/:graphId/toggle/:moduleCode',
    method: 'post',
    validators: [
      param('moduleCode')
        .custom(validModuleCode)
        .withMessage('must be a valid module code'),
    ],
  },
  {
    action: 'updateFrontendProps',
    route: '/graphs/:graphId/update-frontend',
    method: 'post',
    validators: [body('flowNodes').isArray(), body('flowEdges').isArray()],
  },
]
