import type { Module, Degree, User } from '../src/entity'

export namespace Init {
  export type UserProps = {
    displayName: string
    username: string
    modulesDone: string[]
    modulesDoing: string[]
    matriculationYear: number
    graduationYear: number
    graduationSemester: number
  }
  export type DegreeProps = {
    moduleCodes: string[]
    title: string
  }
  export type GraphProps = {
    userId: string
    degreeId: string
    modulesPlacedCodes: string[]
    modulesHiddenCodes: string[]
    pullAll: boolean
  }
}

export type UserProps = {
  displayName: string
  username: string
  modulesDone: Module[]
  modulesDoing: Module[]
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
}

export type DegreeProps = {
  modules: Module[]
  title: string
}

export type GraphProps = {
  user: User
  degree: Degree
  modulesPlaced: Module[]
  modulesHidden: Module[]
}

