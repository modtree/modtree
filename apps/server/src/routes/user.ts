import { body, query } from 'express-validator'

import { UserController } from '../controller'
import { hasOneOf, hasOnly } from '../validate'

import { Route } from './types'

export const userRoutes: Route<UserController>[] = [
  {
    action: 'get',
    route: '/users',
    method: 'get',
    validators: [
      query('id').isUUID().optional(),
      query('email').normalizeEmail().isEmail().optional(),
      query('authZeroId')
        .custom((s: string) => s.startsWith('auth0|'))
        .optional(),
      query().custom(hasOneOf(['id', 'email', 'authZeroId'])),
      query().custom(hasOnly(['id', 'email', 'authZeroId'])),
    ],
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
    action: 'insertDegree',
    route: '/users/insert-degree/:userId',
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
