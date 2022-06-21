import { body, query } from 'express-validator'

import { UserController } from '../controller'
import { hasOneOf, hasOnly } from '../validate'

import { Route } from './types'

export const userRoutes: Route<UserController>[] = [
  {
    action: 'getByPrimaryKeys',
    route: '/users/get-by-primary-keys',
    method: 'post',
    validators: [
      body('id').isUUID().optional(),
      body('email').normalizeEmail().isEmail().optional(),
      body('authZeroId')
        .custom((s: string) => s.startsWith('auth0|'))
        .optional(),
      body().custom(() => hasOneOf(['id', 'email', 'authZeroId'])),
      body().custom(() => hasOnly(['id', 'email', 'authZeroId'])),
    ],
  },
  {
    action: 'get',
    route: '/users/:userId',
    method: 'get',
    validators: [],
  },
  {
    action: 'getFull',
    route: '/users/:userId/get-full',
    method: 'get',
    validators: [],
  },
  {
    action: 'list',
    route: '/users/',
    method: 'get',
    validators: [],
  },
  {
    action: 'create',
    route: '/users',
    method: 'post',
    validators: [
      body('authZeroId').isString().notEmpty(),
      body('email').isEmail(),
    ],
  },
  {
    action: 'insertDegrees',
    route: '/users/:userId/degrees',
    method: 'post',
    validators: [],
  },
  {
    action: 'delete',
    route: '/users/:userId',
    method: 'delete',
    validators: [],
  },
]
