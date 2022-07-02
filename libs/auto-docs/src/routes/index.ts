import { RouteMethod } from '@modtree/types'
import { DegreeRoutes } from './degree'
import { UserRoutes } from './user'
import { ModuleCondensedRoutes, ModuleFullRoutes, ModuleRoutes } from './module'

export type Route = {
  route: string
  method: RouteMethod
  /**
   * url is required when there is a specific route to be called.
   * currently only used for module endpoints.
   */
  url?: string
  /**
   * assumes that there is strictly either body params only
   * or query params only.
   */
  params?: Record<string, any>
}

/**
 * Route will be mapped to JestEach.
 * This allows usage of jest's test.each() util.
 */
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
  ...DegreeRoutes,
  ...UserRoutes,
]
