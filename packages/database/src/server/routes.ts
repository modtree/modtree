import {
  ModuleCondensedController,
  UserController,
  DegreeController,
  GraphController,
} from '../controller'

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I

type Route<T> = {
  action: keyof T
  route: string
  method: 'post' | 'put' | 'patch' | 'get' | 'delete'
}

type RouteWithController<T> = Route<T> & { controller: Class<T> }

/**
 * a factory function that adds routes to an existing route list
 *
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

const moduleCondensedRoutes: Route<ModuleCondensedController>[] = [
  {
    action: 'list',
    route: '/modules/list',
    method: 'get',
  },
  {
    action: 'find',
    route: '/modules/find/:moduleCode',
    method: 'get',
  },
]

const userRoutes: Route<UserController>[] = [
  {
    action: 'create',
    route: '/user/create',
    method: 'post',
  },
  {
    action: 'insertDegree',
    route: '/user/insert-degree/:userId',
    method: 'post',
  },
  {
    action: 'list',
    route: '/user/list',
    method: 'get',
  },
  {
    action: 'getFull',
    route: '/user/get-full/:userId',
    method: 'get',
  },
  {
    action: 'get',
    route: '/user/get/:userId',
    method: 'get',
  },
  {
    action: 'delete',
    route: '/user/delete/:userId',
    method: 'delete',
  },
]

const degreeRoutes: Route<DegreeController>[] = [
  {
    action: 'create',
    route: '/degree/create',
    method: 'post',
  },
  {
    action: 'get',
    route: '/degree/get/:degreeId',
    method: 'get',
  },
  {
    action: 'delete',
    route: '/degree/delete/:degreeId',
    method: 'delete',
  },
  {
    action: 'list',
    route: '/degree/list',
    method: 'get',
  },
]

const graphRoutes: Route<GraphController>[] = [
  {
    action: 'create',
    route: '/graph/create',
    method: 'post',
  },
  {
    action: 'get',
    route: '/graph/get/:graphId',
    method: 'get',
  },
  {
    action: 'delete',
    route: '/graph/delete/:graphId',
    method: 'delete',
  },
  {
    action: 'list',
    route: '/graph/list',
    method: 'get',
  },
]

/**
 * gets all the routes for modtree's API
 *
 * @returns {RouteWithController<any>[]}
 */
function getRoutes(): RouteWithController<any>[] {
  const Routes = []
  addRoutes(Routes, moduleCondensedRoutes, ModuleCondensedController)
  addRoutes(Routes, userRoutes, UserController)
  addRoutes(Routes, degreeRoutes, DegreeController)
  addRoutes(Routes, graphRoutes, GraphController)
  return Routes
}

export const Routes = getRoutes()
