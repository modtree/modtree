import {
  IUser,
  IDegree,
  IGraph,
  IModule,
  IModuleCondensed,
} from './entity-interface'
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
 * Graph API respsonse
 */
export type Graph = Modify<
  IGraph,
  {
    user: string
    degree: string
    modulesPlaced: string[]
    modulesHidden: string[]
  }
>

/**
 * already-flat entities
 */
export type Module = IModule
export type ModuleCondensed = IModuleCondensed
