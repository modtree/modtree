import { RouteWithController, Route, Class } from './types'

/**
 * a factory function that adds routes to an existing route list
 *
 * @param {RouteWithController<T>} arr
 * @param {Route<T>} routes
 * @param {Class<T>} controller
 */
export function addRoutes<T>(
  arr: RouteWithController<any>[],
  routes: Route<T>[],
  controller: Class<T>
) {
  routes.forEach((route) => {
    arr.push({ ...route, controller })
  })
}
