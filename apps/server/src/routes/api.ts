import { body } from 'express-validator'
import { ApiController } from '../controller'
import { Route } from './types'

export const apiRoutes: Route<ApiController>[] = [
  {
    action: 'userLogin',
    route: '/users/login',
    method: 'post',
    validators: [
      /**
       * example:
       * auth0|62a8b56d430b9f20930583f7
       */
      body('authZeroId').matches(/^auth0\|\S{24}/),
      body('email').isEmail(),
    ],
  },
]
