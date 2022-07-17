import { IModuleFull } from '.'
import { IUser, IDegree, IGraph, IModule, IModuleCondensed } from './entities'
import { Modify } from './utils'

/**
 * User API respsonse
 */
export type User = Modify<
  IUser,
  {
    modulesDone: string[]
    modulesDoing: string[]
    savedDegrees: string[]
    savedGraphs: string[]
    mainDegree: string
    mainGraph: string
  }
>

/**
 * Degree API respsonse
 */
export type Degree = Modify<
  IDegree,
  {
    modules: string[]
  }
>

/**
 * Degree API respsonse
 */
export type DegreeFull = IDegree

/**
 * Graph API respsonse
 */
export type Graph = Modify<
  IGraph,
  {
    user: string
    modulesPlaced: string[]
    modulesHidden: string[]
    degree: {
      // drop modules
      id: string
      title: string
    }
  }
>

/**
 * already-flat entities
 */
export type Module = IModule
export type ModuleFull = IModuleFull
export type ModuleCondensed = IModuleCondensed
