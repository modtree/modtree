import { moduleCondensedController } from './controller/ModuleCondensed'

export const Routes = [
  {
    method: 'get',
    route: '/modules',
    controller: moduleCondensedController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/hello',
    controller: moduleCondensedController,
    action: 'hello',
  },
  {
    method: 'get',
    route: '/modules/:moduleCode',
    controller: moduleCondensedController,
    action: 'one',
  },
]
