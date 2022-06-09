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
type User = Modify<
  IUser,
  {
    modulesDone: string[]
    modulesDoing: string[]
    savedDegrees: string[]
    savedGraphs: string[]
  }
>

/**
 * Degree API respsonse
 */
type Degree = Modify<
  IDegree,
  {
    modules: string[]
  }
>

/**
 * Graph API respsonse
 */
type Graph = Modify<
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
type Module = IModule
type ModuleCondensed = IModuleCondensed
