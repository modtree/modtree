import {
  ModuleCondensedController,
  ModuleController,
  UserController,
  DegreeController,
  GraphController,
  ApiController,
} from '../controller'
import { moduleRoutes, moduleCondensedRoutes } from './module'
import { userRoutes } from './user'
import { degreeRoutes } from './degree'
import { graphRoutes } from './graph'
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
  addRoutes(Routes, userRoutes, UserController)
  addRoutes(Routes, degreeRoutes, DegreeController)
  addRoutes(Routes, graphRoutes, GraphController)
  addRoutes(Routes, moduleRoutes, ModuleController)
  addRoutes(Routes, apiRoutes, ApiController)
  return Routes
}
