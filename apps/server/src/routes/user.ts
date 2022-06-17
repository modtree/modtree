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
    route: '/users/list',
    method: 'get',
    validators: [],
  },
  {
    action: 'getFull',
    route: '/users/get-full/:userId',
    method: 'get',
    validators: [],
  },
  {
    action: 'get',
    route: '/users/get/:userId',
    method: 'get',
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
