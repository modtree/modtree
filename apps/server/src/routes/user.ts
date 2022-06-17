import { body } from 'express-validator'
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
    validators: [body('userId').isString()],
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
