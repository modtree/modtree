import {
  moduleCondensedController,
  userController,
  degreeController,
} from '../controller'

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I

type Route<T> = {
  method: 'post' | 'put' | 'patch' | 'get' | 'delete'
  route: string
  action: keyof T
}

type RouteWithController<T> = Route<T> & { controller: Class<T> }

/**
 * a factory function that adds routes to an existing route list
 * @param {RouteWithController<T>} arr
 * @param {Route<T>} routes
 * @param {Class<T>} controller
 */
function addRoutes<T>(
  arr: RouteWithController<T>[],
  routes: Route<T>[],
  controller: Class<T>
) {
  routes.forEach((route) => {
    arr.push({ ...route, controller })
  })
}

/**
 * gets all the routes for modtree's API
 * @return {RouteWithController<any>[]}
 */
function getRoutes(): RouteWithController<any>[] {
  const Routes = []
  addRoutes(Routes, moduleCondensedRoutes, moduleCondensedController)
  addRoutes(Routes, userRoutes, userController)
  addRoutes(Routes, degreeRoutes, degreeController)
  return Routes
}

const moduleCondensedRoutes: Route<moduleCondensedController>[] = [
  {
    method: 'get',
    route: '/modules',
    action: 'all',
  },
  {
    method: 'get',
    route: '/modules/:moduleCode',
    action: 'one',
  },
]

const userRoutes: Route<userController>[] = [
  {
    method: 'post',
    route: '/user/create',
    action: 'create',
  },
  {
    method: 'get',
    route: '/user/all',
    action: 'all',
  },
  {
    method: 'post',
    route: '/user',
    action: 'one',
  },
  {
    method: 'get',
    route: '/user/:userId',
    action: 'get',
  },
]

const degreeRoutes: Route<degreeController>[] = [
  {
    method: 'post',
    route: '/degree/create',
    action: 'create',
  },
  {
    method: 'get',
    route: '/degree/get/:degreeId',
    action: 'get',
  },
  {
    method: 'delete',
    route: '/degree/delete/:degreeId',
    action: 'delete',
  },
  {
    method: 'get',
    route: '/degree/list',
    action: 'list',
  },
]

export const Routes = getRoutes()
