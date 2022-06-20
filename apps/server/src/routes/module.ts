import { body } from 'express-validator'
import { ModuleCondensedController, ModuleController } from '../controller'
import { Route } from './types'

export const moduleCondensedRoutes: Route<ModuleCondensedController>[] = [
  {
    action: 'list',
    route: '/modulesCondensed/',
    method: 'get',
    validators: [],
  },
  {
    action: 'get',
    route: '/modulesCondensed/:moduleCode',
    method: 'get',
    validators: [],
  },
  {
    action: 'findByCodes',
    route: '/modulesCondensed/find-by-codes/',
    method: 'post',
    validators: [body('moduleCodes').notEmpty()],
  },
]

export const moduleRoutes: Route<ModuleController>[] = [
  {
    action: 'get',
    route: '/modules/:moduleCode',
    method: 'get',
    validators: [],
  },
]
