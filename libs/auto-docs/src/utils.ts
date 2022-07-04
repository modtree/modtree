import { RouteMethod } from '@modtree/types'

/**
 * Returns true if the route is performing an entity creation.
 * - e.g POST /user
 */
export function isEntityCreation(method: RouteMethod, route: string) {
  return (
    // POST request
    method === 'post' &&
    // path contains 1 slash (i.e. POST /entity)
    route.split('/').length === 2
  )
}
