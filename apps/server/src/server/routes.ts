import { param, ValidationChain } from 'express-validator'
import { Repositories } from '@modtree/types'
import { copy } from '@modtree/utils'
import { db } from '@modtree/typeorm-config'
import {
  ModuleRepository,
  ModuleCondensedRepository,
  validModuleCode
} from '@modtree/repo-module'
import { DegreeRepository } from '@modtree/repo-degree'
import { UserRepository } from '@modtree/repo-user'
import { GraphRepository } from '@modtree/repo-graph'
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
  validators: ValidationChain[]
}

type RouteWithController<T> = Route<T> & {
  controller: Class<T>
  validators: ValidationChain[]
}

const Repo: Repositories = {}

/**
 * a factory function that adds routes to an existing route list
 *
 * @param {RouteWithController<T>} arr
 * @param {Route<T>} routes
 * @param {Class<T>} controller
 */
function addRoutes<T>(
  arr: RouteWithController<any>[],
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
    validators: [],
  },
  {
    action: 'find',
    route: '/modules/find/:moduleCode',
    method: 'get',
    validators: [],
  },
]

const userRoutes: Route<UserController>[] = [
  {
    action: 'create',
    route: '/user/create',
    method: 'post',
    validators: [],
  },
  {
    action: 'insertDegree',
    route: '/user/insert-degree/:userId',
    method: 'post',
    validators: [],
  },
  {
    action: 'list',
    route: '/user/list',
    method: 'get',
    validators: [],
  },
  {
    action: 'getFull',
    route: '/user/get-full/:userId',
    method: 'get',
    validators: [],
  },
  {
    action: 'get',
    route: '/user/get/:userId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/user/delete/:userId',
    method: 'delete',
    validators: [],
  },
]

const degreeRoutes: Route<DegreeController>[] = [
  {
    action: 'create',
    route: '/degree/create',
    method: 'post',
    validators: [],
  },
  {
    action: 'get',
    route: '/degree/get/:degreeId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/degree/delete/:degreeId',
    method: 'delete',
    validators: [],
  },
  {
    action: 'list',
    route: '/degree/list',
    method: 'get',
    validators: [],
  },
]

const graphRoutes: Route<GraphController>[] = [
  {
    action: 'create',
    route: '/graph/create',
    method: 'post',
    validators: [],
  },
  {
    action: 'get',
    route: '/graph/get/:graphId',
    method: 'get',
    validators: [],
  },
  {
    action: 'delete',
    route: '/graph/delete/:graphId',
    method: 'delete',
    validators: [],
  },
  {
    action: 'list',
    route: '/graph/list',
    method: 'get',
    validators: [],
  },
  {
    action: 'toggle',
    route: '/graph/id/:graphId/toggle/:moduleCode',
    method: 'post',
    validators: [
      param('moduleCode')
        .custom(validModuleCode)
        .withMessage('must be a valid module code'),
    ],
  },
]

/**
 * gets all the routes for modtree's API
 *
 * @returns {RouteWithController<any>[]}
 */
export function getRoutes(): RouteWithController<any>[] {
  const loadRepositories = {
    Degree: new DegreeRepository(db),
    User: new UserRepository(db),
    Graph: new GraphRepository(db),
    Module: new ModuleRepository(db),
    ModuleCondensed: new ModuleCondensedRepository(db),
  }
  copy(loadRepositories, Repo)

  const Routes: RouteWithController<any>[] = []
  addRoutes(Routes, moduleCondensedRoutes, ModuleCondensedController)
  addRoutes(Routes, userRoutes, UserController)
  addRoutes(Routes, degreeRoutes, DegreeController)
  addRoutes(Routes, graphRoutes, GraphController)
  return Routes
}
