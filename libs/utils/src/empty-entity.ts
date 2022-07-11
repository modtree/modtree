import {
  IUser,
  IGraph,
  IDegree,
  IModule,
  IModuleCondensed,
  IModuleFull,
  ModtreeApiResponse,
} from '@modtree/types'

const Module: IModule = {
  id: '',
  moduleCode: '',
  title: '',
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  prereqTree: '',
  fulfillRequirements: [],
}

const Degree: ModtreeApiResponse.Degree = {
  id: '',
  modules: [], // string arr
  title: '',
}

const DegreeFull: ModtreeApiResponse.DegreeFull = {
  id: '',
  modules: [], // modules arr
  title: '',
}

const User: IUser = {
  id: '',
  authZeroId: '',
  displayName: '',
  username: '',
  modulesDone: [],
  modulesDoing: [],
  matriculationYear: 0,
  graduationYear: 0,
  graduationSemester: 0,
  email: '',
  savedDegrees: [],
  savedGraphs: [],
}

const UserFull: ModtreeApiResponse.UserFull = {
  id: '',
  authZeroId: '',
  displayName: '',
  username: '',
  modulesDone: [],
  modulesDoing: [],
  matriculationYear: 0,
  graduationYear: 0,
  graduationSemester: 0,
  email: '',
  savedDegrees: [],
  savedGraphs: [],
  mainGraph: '',
}

const Graph: IGraph = {
  title: '',
  id: '',
  user: User,
  degree: DegreeFull,
  modulesPlaced: [],
  modulesHidden: [],
  flowNodes: [],
  flowEdges: [],
}

const GraphFull: ModtreeApiResponse.GraphFull = {
  title: '',
  id: '',
  user: '',
  degree: Degree,
  modulesPlaced: [],
  modulesHidden: [],
  flowNodes: [],
  flowEdges: [],
}

const ModuleCondensed: IModuleCondensed = {
  id: '',
  moduleLevel: 0,
  moduleCode: '',
  title: '',
}

const ModuleFull: IModuleFull = {
  id: '',
  acadYear: '',
  moduleCode: '',
  title: '',
  description: '',
  moduleCredit: '',
  department: '',
  faculty: '',
  aliases: [],
  attributes: {},
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  fulfillRequirements: [],
  semesterData: [],
  prereqTree: '',
  workload: '',
}

export const empty = {
  Module,
  ModuleFull,
  ModuleCondensed,
  User,
  UserFull,
  Graph,
  GraphFull,
  DegreeFull,
}
