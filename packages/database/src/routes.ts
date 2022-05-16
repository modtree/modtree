import { ModuleCondesnedController } from './controller/ModuleCondensedController'

export const Routes = [
  {
    method: 'get',
    route: '/modules',
    controller: ModuleCondesnedController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/modules/:moduleCode',
    controller: ModuleCondesnedController,
    action: 'one',
  },
]
