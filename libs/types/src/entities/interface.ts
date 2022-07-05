import type { Node, Edge } from 'react-flow-renderer'
import type { SemesterData, NUSModuleAttributes, PrereqTree } from './nusmods'

export type EntityName =
  | 'user'
  | 'degree'
  | 'graph'
  | 'module'
  | 'moduleCondensed'
  | 'moduleFull'

export type EntityClassName =
  | 'User'
  | 'Degree'
  | 'Graph'
  | 'Module'
  | 'ModuleCondensed'
  | 'ModuleFull'

export type IBase = {
  id: string
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
  mainDegree?: IDegree
  mainGraph?: IGraph
}

export type IDegree = IBase & {
  title: string
  modules: IModule[]
}

export type GraphFlowNode = Node<IModule>
export type GraphFlowEdge = {
  id: string // CS1010-CS2040S
  source: string // CS1010
  target: string // CS2040S
} & Edge

export type GraphFrontendProps = {
  flowNodes: GraphFlowNode[]
  flowEdges: GraphFlowEdge[]
}

export type IGraph = IBase &
  GraphFrontendProps & {
    user: IUser
    degree: IDegree
    modulesPlaced: IModule[]
    modulesHidden: IModule[]
  }

export type IModule = IBase & {
  title: string
  moduleCode: string
  prerequisite: string
  corequisite: string
  preclusion: string
  fulfillRequirements: string[]
  prereqTree: PrereqTree
}

export type IModuleFull = IBase & {
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
