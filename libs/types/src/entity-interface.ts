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
  mainGraph: IGraph
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
  title: string
  moduleCode: string
  prerequisite: string
  corequisite: string
  preclusion: string
  fulfillRequirements: string[]
  prereqTree: PrereqTree
}

export type IModuleCondensed = IBase & {
  title: string
  moduleCode: string
  moduleLevel: number
}
