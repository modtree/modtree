import type { Route } from './types'
import {
  UserApi,
  DegreeApi,
  GraphApi,
  ModuleApi,
  ModuleCondensedApi,
  ModuleFullApi,
} from './api'
import { body, param, query } from 'express-validator'
import { validModuleCode } from '@modtree/utils'
import { ModuleStatus } from '@modtree/types'

const moduleStatuses = Object.values(ModuleStatus)

export const routes: Route[] = [
  /**
   * User API
   */
  {
    method: 'get',
    route: '/users',
    fn: UserApi.list,
    validators: [
      query('id').isUUID().optional(),
      query('email').normalizeEmail().isEmail().optional(),
      query('authZeroId')
        .custom((s: string) => s.startsWith('auth0|'))
        .optional(),
    ],
  },
  {
    method: 'get',
    route: '/user/:userId',
    fn: UserApi.get,
    validators: [],
  },
  {
    method: 'post',
    route: '/user/:authZeroId/login',
    fn: UserApi.login,
    // validators: [body('email').isEmail()],
    validators: [],
  },
  {
    method: 'get',
    route: '/user/:userId/get-full',
    fn: UserApi.getFull,
    validators: [],
  },
  {
    method: 'post',
    route: '/user',
    fn: UserApi.create,
    validators: [
      body('authZeroId').isString().notEmpty(),
      body('email').isEmail(),
    ],
  },
  {
    method: 'patch',
    route: '/user/:userId/degree',
    fn: UserApi.insertDegrees,
    validators: [body('degreeIds').isArray().notEmpty()],
  },
  {
    method: 'delete',
    route: '/user/:userId/degree/:degreeId',
    fn: UserApi.removeDegree,
    validators: [],
  },
  {
    method: 'delete',
    route: '/user/:userId',
    fn: UserApi.delete,
    validators: [],
  },
  {
    method: 'patch',
    route: '/user/:userId/module',
    fn: UserApi.setModuleStatus,
    validators: [body('status').isString().isIn(moduleStatuses)],
  },
  {
    method: 'patch',
    route: '/user/:userId/graph',
    fn: UserApi.insertGraphs,
    validators: [body('graphIds').isArray().notEmpty()],
  },
  {
    method: 'patch',
    route: '/user/:userId/main-degree',
    fn: UserApi.setMainDegree,
    validators: [body('degreeId').isString().notEmpty()],
  },
  {
    method: 'patch',
    route: '/user/:userId/main-graph',
    fn: UserApi.setMainGraph,
    validators: [body('graphId').isString().notEmpty()],
  },
  {
    method: 'post',
    route: '/user/:userId/can-take-modules',
    fn: UserApi.canTakeModules,
    validators: [body('moduleCodes').isArray().notEmpty()],
  },

  /**
   * Degree API
   */
  {
    method: 'get',
    route: '/degrees',
    fn: DegreeApi.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/degree/:degreeId',
    fn: DegreeApi.get,
    validators: [],
  },
  {
    method: 'get',
    route: '/degree/:degreeId/get-full',
    fn: DegreeApi.getFull,
    validators: [],
  },
  {
    method: 'post',
    route: '/degree',
    fn: DegreeApi.create,
    validators: [
      body('title').notEmpty(),
      body('moduleCodes').isArray().notEmpty(),
    ],
  },
  {
    method: 'delete',
    route: '/degree/:degreeId',
    fn: DegreeApi.delete,
    validators: [],
  },
  {
    method: 'patch',
    route: '/degree/:degreeId',
    fn: DegreeApi.modify,
    validators: [
      body('title').isString().notEmpty(),
      body('moduleCodes').isArray().notEmpty(),
    ],
  },

  /**
   * Graph API
   */
  {
    method: 'get',
    route: '/graphs',
    fn: GraphApi.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/graph/:graphId',
    fn: GraphApi.get,
    validators: [],
  },
  {
    method: 'get',
    route: '/graph/:graphId/get-full',
    fn: GraphApi.getFull,
    validators: [],
  },
  {
    method: 'delete',
    route: '/graph/:graphId',
    fn: GraphApi.delete,
    validators: [],
  },
  {
    method: 'post',
    route: '/graph',
    fn: GraphApi.create,
    validators: [body('title').isString().notEmpty()],
  },
  {
    method: 'patch',
    route: '/graph/:graphId/toggle/:moduleCode',
    fn: GraphApi.toggle,
    validators: [
      param('moduleCode')
        .custom(validModuleCode)
        .withMessage('must be a valid module code'),
    ],
  },
  {
    method: 'patch',
    route: '/graph/:graphId/flow',
    fn: GraphApi.updateFrontendProps,
    validators: [body('flowNodes').isArray(), body('flowEdges').isArray()],
  },
  {
    method: 'patch',
    route: '/graph/:graphId/node',
    fn: GraphApi.updateFlowNode,
    validators: [body('flowNode').notEmpty()],
  },
  {
    method: 'post',
    route: '/graph/:graphId/suggest',
    fn: GraphApi.suggestModules,
    validators: [body('selectedCodes').isArray()],
  },
  {
    method: 'post',
    route: '/graph/:graphId/can-take-modules',
    fn: GraphApi.canTakeModules,
    validators: [body('moduleCodes').isArray().notEmpty()],
  },

  /**
   * Module API
   */
  {
    method: 'get',
    route: '/modules',
    fn: ModuleApi.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/module/:moduleCode',
    fn: ModuleApi.get,
    validators: [],
  },
  {
    method: 'get',
    route: '/search/modules/:searchQuery',
    fn: ModuleApi.search,
    validators: [param('searchQuery').notEmpty()],
  },

  /**
   * Module Condensed API
   */
  {
    method: 'get',
    route: '/modules-condensed',
    fn: ModuleCondensedApi.list,
    validators: [query('moduleCodes').optional().isArray()],
  },
  {
    method: 'get',
    route: '/module-condensed/:moduleCode',
    fn: ModuleCondensedApi.get,
    validators: [],
  },
  {
    method: 'get',
    route: '/search/modules-condensed/:searchQuery',
    fn: ModuleCondensedApi.search,
    validators: [],
  },

  /**
   * Module Full API
   */
  {
    method: 'get',
    route: '/module-full/:moduleCode',
    fn: ModuleFullApi.get,
    validators: [param('moduleCode').custom(validModuleCode)],
  },
]
