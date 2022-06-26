import type { Route } from './types'
import {
  UserApi,
  DegreeApi,
  GraphApi,
  ModuleApi,
  ModuleCondensedApi,
} from './api'
import { body, param, query } from 'express-validator'
import { validModuleCode } from '@modtree/utils'

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
    route: '/user/:userId/degrees',
    fn: UserApi.insertDegrees,
    validators: [body('degreeIds').isArray().notEmpty()],
  },
  {
    method: 'delete',
    route: '/user/:userId',
    fn: UserApi.delete,
    validators: [],
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
    method: 'delete',
    route: '/graph/:graphId',
    fn: GraphApi.delete,
    validators: [],
  },
  {
    method: 'post',
    route: '/graph',
    fn: GraphApi.create,
    validators: [],
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
    route: '/modules-condensed/search/:searchQuery',
    fn: ModuleCondensedApi.search,
    validators: [],
  },
]
