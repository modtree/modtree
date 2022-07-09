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
  newProp2: '',
  moduleCode: '',
  title: '',
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  prereqTree: '',
  fulfillRequirements: [],
}

const Degree: IDegree = {
  id: '',
  modules: [],
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
  degree: Degree,
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
  Degree,
}
