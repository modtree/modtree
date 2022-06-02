import {
  moduleCondensedController,
  userController,
  degreeController,
  graphController,
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
  addRoutes(Routes, graphRoutes, graphController)
  return Routes
}

const moduleCondensedRoutes: Route<moduleCondensedController>[] = [
  {
    method: 'get',
    route: '/modules/list',
    action: 'list',
  },
  {
    method: 'get',
    route: '/modules/find/:moduleCode',
    action: 'find',
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
    route: '/user/list',
    action: 'list',
  },
  {
    method: 'get',
    route: '/user/get/:userId',
    action: 'get',
  },
  {
    method: 'delete',
    route: '/user/delete/:userId',
    action: 'delete',
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

const graphRoutes: Route<graphController>[] = [
  {
    method: 'post',
    route: '/graph/create',
    action: 'create',
  },
  {
    method: 'get',
    route: '/graph/get/:graphId',
    action: 'get',
  },
  {
    method: 'delete',
    route: '/graph/delete/:graphId',
    action: 'delete',
  },
  {
    method: 'get',
    route: '/graph/list',
    action: 'list',
  },
]

export const Routes = getRoutes()
