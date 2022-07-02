import { RouteMethod } from '@modtree/types'
import { ModuleCondensedRoutes, ModuleFullRoutes, ModuleRoutes } from './module'

export type Route = {
  route: string
  method: RouteMethod
  url?: string
  params?: Record<string, any>
}

// to use test.each()
export type JestEach = [
  RouteMethod,
  string,
  {
    url?: string
    params?: Record<string, any>
  }
]

// TODO consider referring to references/routes.json to
// make sure this is updated
//
// however filling in the route properties will probably be manual
export const routes: Route[] = [
  ...ModuleCondensedRoutes,
  ...ModuleRoutes,
  ...ModuleFullRoutes,
]
