import { RouteMethod } from '@modtree/types'
import { ModuleCondensedRoutes, ModuleFullRoutes, ModuleRoutes } from './module'

type RouteInfo = {
  url: string
  params?: Record<string, any>
}

export type JestEach = [RouteMethod, string, RouteInfo]

// TODO consider referring to references/routes.json to
// make sure this is updated
//
// however filling in the route properties will probably be manual
export const routes: JestEach[] = [
  ...ModuleCondensedRoutes,
  ...ModuleRoutes,
  ...ModuleFullRoutes,
]
