import { Module as NM, ModuleCondensed as NMC } from './nusmods'

export type InitProps = {
  /**
   * props to initialize a User
   */
  User: {
    authZeroId: string
    displayName: string
    username: string
    modulesDone: string[]
    modulesDoing: string[]
    matriculationYear: number
    graduationYear: number
    graduationSemester: number
    email: string
  }

  /**
   * props to initialize a Degree
   */
  Degree: {
    moduleCodes: string[]
    title: string
  }

  /**
   * props to initialize a Graph
   */
  Graph: {
    userId: string
    degreeId: string
    modulesPlacedCodes: string[]
    modulesHiddenCodes: string[]
    pullAll: boolean
  }

  /**
   * props to initialize a Module
   */
  Module: NM

  /**
   * props to initialize a ModuleCondensed
   */
  ModuleCondensed: {
    moduleCode: string
    title: string
  }
}
