import type { Node, Edge } from 'react-flow-renderer'
import { ModtreeApiResponse } from '.'
import type { SemesterData, NUSModuleAttributes, PrereqTree } from './nusmods'

export type EntityName =
  | 'user'
  | 'degree'
  | 'graph'
  | 'module'
  | 'moduleCondensed'

export type IBase = {
  id: string
}

export type GraphFrontendProps = {
  flowNodes: Node<ModtreeApiResponse.ModuleCondensed>[]
  flowEdges: Edge[]
}

export type IUser = IBase & {
  authZeroId: string
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
  mainDegree: IDegree
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
} & GraphFrontendProps

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
