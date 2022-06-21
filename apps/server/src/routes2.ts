import type { Route } from '.'
import {
  UserController,
  DegreeController,
  GraphController,
  ModuleController,
  ModuleCondensedController,
} from './controller2'
import { body, param, query } from 'express-validator'
import { validModuleCode } from '@modtree/utils'

export const routes2: Route[] = [
  /**
   * User API
   */
  {
    method: 'get',
    route: '/users',
    fn: UserController.list,
    validators: [
      body('id').isUUID().optional(),
      body('email').normalizeEmail().isEmail().optional(),
      body('authZeroId')
        .custom((s: string) => s.startsWith('auth0|'))
        .optional(),
    ],
  },
  {
    method: 'get',
    route: '/users/:userId',
    fn: UserController.get,
    validators: [],
  },
  {
    method: 'post',
    route: '/users/:authZeroId/login',
    fn: UserController.login,
    // validators: [body('email').isEmail()],
    validators: [],
  },
  {
    method: 'get',
    route: '/users/:userId/get-full',
    fn: UserController.getFull,
    validators: [],
  },
  {
    method: 'post',
    route: '/users',
    fn: UserController.create,
    validators: [
      body('authZeroId').isString().notEmpty(),
      body('email').isEmail(),
    ],
  },
  {
    method: 'post',
    route: '/users/:userId/degrees',
    fn: UserController.insertDegrees,
    validators: [],
  },
  {
    method: 'delete',
    route: '/users/:userId',
    fn: UserController.delete,
    validators: [],
  },

  /**
   * Degree API
   */
  {
    method: 'get',
    route: '/degrees',
    fn: DegreeController.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/degrees/:degreeId',
    fn: DegreeController.get,
    validators: [],
  },
  {
    method: 'post',
    route: '/degrees',
    fn: DegreeController.create,
    validators: [],
  },
  {
    method: 'delete',
    route: '/degrees/:degreeId',
    fn: DegreeController.delete,
    validators: [],
  },

  /**
   * Graph API
   */
  {
    method: 'get',
    route: '/graphs',
    fn: GraphController.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/graphs/:graphId',
    fn: GraphController.get,
    validators: [],
  },
  {
    method: 'delete',
    route: '/graphs/:graphId',
    fn: GraphController.delete,
    validators: [],
  },
  {
    method: 'post',
    route: '/graphs',
    fn: GraphController.create,
    validators: [],
  },
  {
    method: 'post',
    route: '/graphs/:graphId/toggle/:moduleCode',
    fn: GraphController.toggle,
    validators: [
      param('moduleCode')
        .custom(validModuleCode)
        .withMessage('must be a valid module code'),
    ],
  },
  {
    method: 'post',
    route: '/graphs/:graphId/flow',
    fn: GraphController.updateFrontendProps,
    validators: [body('flowNodes').isArray(), body('flowEdges').isArray()],
  },

  /**
   * Module API
   */
  {
    method: 'get',
    route: '/modules',
    fn: ModuleController.list,
    validators: [],
  },
  {
    method: 'get',
    route: '/modules/:moduleCode',
    fn: ModuleController.get,
    validators: [],
  },

  /**
   * Module Condensed API
   */
  {
    method: 'get',
    route: '/modules-condensed',
    fn: ModuleCondensedController.list,
    validators: [query('moduleCodes').optional().isArray()],
  },
  {
    method: 'get',
    route: '/modules-condensed/:moduleCode',
    fn: ModuleCondensedController.get,
    validators: [],
  },
]
