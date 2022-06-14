import { FlowEdgeCondensed, FlowNodeCondensed } from './flow'
import { SemesterData, NUSModuleAttributes, PrereqTree } from './nusmods'

export type IBase = {
  id: string
}

export type IUser = IBase & {
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

export type IDegree = IBase & {
  title: string
  modules: IModule[]
}

export type IGraph = IBase & {
  user: IUser
  degree: IDegree
  modulesPlaced: IModule[]
  modulesHidden: IModule[]
  flowNodes: FlowNodeCondensed[]
  flowEdges: FlowEdgeCondensed[]
}

export type IModule = IBase & {
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

export type IModuleCondensed = IBase & {
  title: string
  moduleCode: string
  moduleLevel: number
}
