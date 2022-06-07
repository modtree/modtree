import {
  User as UserEntity,
  Degree as DegreeEntity,
  Graph as GraphEntity,
  Module as ModuleEntity,
  ModuleCondensed as ModuleCondensedEntity,
} from '../src/entity'

/**
 * entities without properties that have relations
 */
export type Relationless = {
  /**
   * User without relations
   */
  User: Omit<
    UserEntity,
    'modulesDone' | 'modulesDoing' | 'savedDegrees' | 'savedGraphs'
  >

  /**
   * Degree without relations
   */
  Degree: Omit<DegreeEntity, 'modules'>

  /**
   * Graph without relations
   */
  Graph: Omit<
    GraphEntity,
    'user' | 'degree' | 'modulesPlaced' | 'modulesHidden'
  >
}

/**
 * API response shapes
 */
export type ResponseProps = {
  /**
   * User API respsonse
   */
  User: Relationless['User'] & {
    modulesDone: string[]
    modulesDoing: string[]
    savedDegrees: string[]
    savedGraphs: string[]
  }

  /**
   * Degree API respsonse
   */
  Degree: Relationless['Degree'] & {
    modules: string[]
  }

  /**
   * Graph API respsonse
   */
  Graph: Relationless['Graph'] & {
    user: string
    degree: string
    modulesPlaced: string[]
    modulesHidden: string[]
  }

  /**
   * already-flat entities
   */
  Module: ModuleEntity
  ModuleCondensed: ModuleCondensedEntity
}
