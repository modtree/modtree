import { body } from 'express-validator'
import { ModuleCondensedController, ModuleController } from '../controller'
import { Route } from './types'

export const moduleCondensedRoutes: Route<ModuleCondensedController>[] = [
  {
    action: 'list',
    route: '/modules/list',
    method: 'get',
    validators: [],
  },
  {
    action: 'find',
    route: '/modules/find/:moduleCode',
    method: 'get',
    validators: [],
  },
  {
    action: 'findByCodes',
    route: '/modules/find-by-codes/',
    method: 'post',
    validators: [body('moduleCodes').notEmpty()],
  },
]

export const moduleRoutes: Route<ModuleController>[] = [
  {
    action: 'get',
    route: '/modules/info/:moduleCode',
    method: 'get',
    validators: [],
  },
]
