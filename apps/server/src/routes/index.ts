import {
  ModuleCondensedController,
  ModuleController,
  ApiController,
} from '../controller'
import { moduleRoutes, moduleCondensedRoutes } from './module'
import { apiRoutes } from './api'
import { RouteWithController } from './types'
import { addRoutes } from './utils'

/**
 * gets all the routes for modtree's API
 *
 * @returns {RouteWithController<any>[]}
 */
export function getRoutes(): RouteWithController<any>[] {
  const Routes: RouteWithController<any>[] = []
  addRoutes(Routes, moduleCondensedRoutes, ModuleCondensedController)
  addRoutes(Routes, moduleRoutes, ModuleController)
  addRoutes(Routes, apiRoutes, ApiController)
  return Routes
}
