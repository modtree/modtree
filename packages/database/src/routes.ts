import { moduleCondensedController } from './controller/ModuleCondensedController'

export const Routes = [
  {
    method: 'get',
    route: '/modules',
    controller: moduleCondensedController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/modules/:moduleCode',
    controller: moduleCondensedController,
    action: 'one',
  },
]
