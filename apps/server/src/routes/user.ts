import { body, query } from 'express-validator'
import { UserController } from '../controller'
import { Route } from './types'

export const userRoutes: Route<UserController>[] = [
  {
    action: 'create',
    route: '/users/create',
    method: 'post',
    validators: [body('authZeroId').notEmpty()],
  },
  {
    action: 'insertDegree',
    route: '/users/insert-degree/:userId',
    method: 'post',
    validators: [],
  },
  {
    action: 'list',
    route: '/users',
    method: 'get',
    validators: [
      query('id').isUUID().optional(),
      query('email').normalizeEmail().isEmail().optional(),
      query('authZeroId').isString().optional(),
      query('authZeroId')
        .custom((value: string) => value.startsWith('auth0|'))
        .optional(),
    ],
  },
  {
    action: 'getByEmail',
    route: '/users/get-by-email',
    method: 'post',
    validators: [body('email').isEmail()],
  },
  {
    action: 'delete',
    route: '/users/delete/:userId',
    method: 'delete',
    validators: [],
  },
]
