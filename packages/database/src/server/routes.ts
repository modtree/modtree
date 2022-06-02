import { moduleCondensedController, userController } from '../controller'
import { degreeController } from '../controller/Degree'

type Class<I, Args extends any[] = any[]> = new (...args: Args) => I

type Route<T> = {
  method: string
  route: string
  controller: Class<T>
  action: string
}

function addRoutes<T>(
  arr: Route<T>[],
  routes: Omit<Route<T>, 'controller'>[],
  controller: Class<T>
) {
  routes.forEach((route) => {
    arr.push({ ...route, controller })
  })
}

function getRoutes() {
  const Routes: Route<any>[] = []
  addRoutes(Routes, moduleCondensedRoutes, moduleCondensedController)
  addRoutes(Routes, userRoutes, userController)
  addRoutes(Routes, degreeRoutes, degreeController)
  return Routes
}

const moduleCondensedRoutes = [
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

const userRoutes = [
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

const degreeRoutes = [
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
