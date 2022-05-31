import { moduleCondensedController } from '../controller/ModuleCondensed'

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
