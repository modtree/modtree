import { moduleCondensedController, userController } from '../controller'

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
  {
    method: 'post',
    route: '/user/create',
    controller: userController,
    action: 'create',
  },
]
