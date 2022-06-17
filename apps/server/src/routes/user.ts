import { body, query } from 'express-validator'
import { UserController } from '../controller'
import { Route } from './types'

export const userRoutes: Route<UserController>[] = [
  {
    action: 'get',
    route: '/users',
    method: 'get',
    validators: [
      query('id').isUUID().optional(),
      query('email').normalizeEmail().isEmail().optional(),
      query('authZeroId').isString().optional(),
      query('authZeroId')
        .custom((value: string) => value.startsWith('auth0|'))
        .optional(),
      query()
        .custom((_, { req }) => {
          const required = [req.query.id, req.query.authZeroId, req.query.email]
          if (required.every((x) => x === undefined)) return false
          return true
        })
        .withMessage('Please specify either an id, email, or authZeroId.'),
    ],
  },
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
