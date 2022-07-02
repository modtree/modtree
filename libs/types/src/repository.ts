import { DeleteResult, Repository } from 'typeorm'
import { InitProps } from './init-props'
import {
  IGraph,
  IUser,
  IDegree,
  IModule,
  IModuleFull,
  IModuleCondensed,
  GraphFrontendProps,
  FlowNode,
} from './entity-interface'

export type FindByKey<T> = (query: string) => Promise<T>

export enum ModuleStatus {
  NOT_TAKEN = 'notTaken',
  DONE = 'done',
  DOING = 'doing',
}

export interface IGraphRepository extends Repository<IGraph> {
  initialize(props: InitProps['Graph']): Promise<IGraph>
  deleteAll(): Promise<DeleteResult>
  findOneById: FindByKey<IGraph>
  toggleModule(graph: IGraph, moduleCode: string): Promise<IGraph>
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<IGraph>
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[IGraph[], number]>
  getSuggestModulesParams(
    graph: IGraph,
    modulesSelected: string[]
  ): Promise<[string[], string[], string[], string[]]>
  suggestModules(graph: IGraph, moduleCodes: string[]): Promise<IModule[]>
  updateFrontendProps(graph: IGraph, props: GraphFrontendProps): Promise<IGraph>
  updateFlowNode(graph: IGraph, node: FlowNode): Promise<IGraph>
  findByIds(id: string[]): Promise<IGraph[]>
}

export interface IUserRepository extends Repository<IUser> {
  initialize(props: InitProps['User']): Promise<IUser>
  findOneById: FindByKey<IUser>
  deleteAll(): Promise<DeleteResult>
  canTakeModule(user: IUser, moduleCode: string): Promise<boolean>
  findOneByUsername(username: string): Promise<IUser>
  findOneByAuthZeroId(authZeroId: string): Promise<IUser>
  findOneByEmail(email: string): Promise<IUser>
  getEligibleModules(user: IUser): Promise<IModule[]>
  getPostReqs(user: IUser): Promise<IModule[]>
  getUnlockedModules(user: IUser, moduleCode: string): Promise<IModule[]>
  hasTakenModule(user: IUser, moduleCode: string): Promise<boolean>
  filterTakenModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  setMainDegree(user: IUser, degreeId: string): Promise<IUser>
  insertDegrees(user: IUser, degreeIds: string[]): Promise<IUser>
  findDegree(user: IUser, degreeId: string): Promise<IDegree>
  removeDegree(user: IUser, degreeId: string): Promise<IUser>
  setModuleStatus(
    user: IUser,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<IUser>
  setMainGraph(user: IUser, graphId: string): Promise<IUser>
  insertGraphs(user: IUser, graphIds: string[]): Promise<IUser>
}

export interface IDegreeRepository extends Repository<IDegree> {
  initialize(props: InitProps['Degree']): Promise<IDegree>
  findOneById: FindByKey<IDegree>
  deleteAll(): Promise<DeleteResult>
  insertModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  findOneByTitle(title: string): Promise<IDegree>
  findByIds(id: string[]): Promise<IDegree[]>
}

export interface IModuleRepository extends Repository<IModule> {
  initialize(props: InitProps['Module']): Promise<IModule>
  findOneById: FindByKey<IModule>
  deleteAll(): Promise<DeleteResult>
  getCodes(): Promise<string[]>
  findByCodes(moduleCodes: string[]): Promise<IModule[]>
  canTakeModule(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<boolean>
  getPostReqs(moduleCodes: string[]): Promise<string[]>
  getEligibleModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[]
  ): Promise<string[]>
  getSuggestedModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[],
    requiredModules: string[]
  ): Promise<string[]>
  getUnlockedModules(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<string[]>
}

export interface IModuleCondensedRepository
  extends Repository<IModuleCondensed> {
  initialize(props: InitProps['ModuleCondensed']): Promise<IModuleCondensed>
  findOneById: FindByKey<IModuleCondensed>
  deleteAll(): Promise<DeleteResult>
  getCodes(): Promise<string[]>
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]>
}

export interface IModuleFullRepository extends Repository<IModuleFull> {
  findOneByCode: FindByKey<IModuleFull>
}

export type Repositories = {
  Module: IModuleRepository
  ModuleFull: IModuleFullRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}
