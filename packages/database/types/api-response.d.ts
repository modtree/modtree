import type {
  User as UserEntity,
  Degree as DegreeEntity,
  Graph as GraphEntity,
  Module as ModuleEntity,
  ModuleCondensed as ModuleCondensedEntity,
} from '../src/entity'

/**
 * entities without properties that have relations
 */
export namespace relationless {
  /**
   * User without relations
   */
  export type User = Omit<
    UserEntity,
    'modulesDone' | 'modulesDoing' | 'savedDegrees' | 'savedGraphs'
  >

  /**
   * Degree without relations
   */
  export type Degree = Omit<DegreeEntity, 'modules'>

  /**
   * Graph without relations
   */
  export type Graph = Omit<
    GraphEntity,
    'user' | 'degree' | 'modulesPlaced' | 'modulesHidden'
  >
}

/**
 * API response shapes
 */
export namespace response {
  /**
   * User API respsonse
   */
  export interface User extends relationless.User {
    modulesDone: string[]
    modulesDoing: string[]
    savedDegrees: string[]
    savedGraphs: string[]
  }

  /**
   * Degree API respsonse
   */
  export interface Degree extends relationless.Degree {
    modules: string[]
  }

  /**
   * Graph API respsonse
   */
  export interface Graph extends relationless.Graph {
    user: string
    degree: string
    modulesPlaced: string[]
    modulesHidden: string[]
  }

  /**
   * already-flat entities
   */
  export type Module = ModuleEntity
  export type ModuleCondensed = ModuleCondensedEntity
}
