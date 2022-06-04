import {
  NUSModuleAttributes,
  PrereqTree,
  SemesterData,
} from '../../types/nusmods'

export interface IUser {
  id: string
  displayName: string
  username: string
  email: string
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
  modulesDone: IModule[]
  modulesDoing: IModule[]
  savedDegrees: IDegree[]
  savedGraphs: IGraph[]
}

export interface IDegree {
  id: string
  title: string
  modules: IModule[]
}

export interface IGraph {
  id: string
  user: IUser
  degree: IDegree
  modulesPlaced: IModule[]
  modulesHidden: IModule[]
}

export interface IModule {
  id: string
  acadYear: string
  moduleCode: string
  title: string
  description: string
  moduleCredit: string
  department: string
  faculty: string
  aliases: string[]
  attributes: NUSModuleAttributes
  prerequisite: string
  corequisite: string
  preclusion: string
  fulfillRequirements: string[]
  semesterData: SemesterData[]
  prereqTree: PrereqTree
  workload: string | number[]
}

export interface IModuleCondensed {
  id: string
  title: string
  moduleCode: string
  moduleLevel: number
}
