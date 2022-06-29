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
    modules: IModule[]
  }
>

/**
 * Graph API respsonse
 */
export type Graph = Modify<
  IGraph,
  {
    user: IUser
    degree: IDegree
    modulesPlaced: IModule[]
    modulesHidden: IModule[]
  }
>

/**
 * already-flat entities
 */
export type Module = IModule
export type ModuleCondensed = IModuleCondensed
