import {
  moduleCondensedController,
  userController,
  degreeController,
} from '../controller'

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I

type Route<T> = {
  method: string
  route: string
  action: keyof T
}

type RouteWithController<T> = Route<T> & { controller: Class<T> }

function addRoutes<T>(
  arr: RouteWithController<T>[],
  routes: Route<T>[],
  controller: Class<T>
) {
  routes.forEach((route) => {
    arr.push({ ...route, controller })
  })
}

function getRoutes() {
  const Routes: RouteWithController<any>[] = []
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
    route: '/degree/:degreeId',
    action: 'get',
  },
]

export const Routes = getRoutes()
