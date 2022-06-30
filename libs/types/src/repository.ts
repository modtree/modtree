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
} from './entity-interface'

export type FindByKey<T> = (query: string) => Promise<T>

export enum ModuleStatus {
  NOT_TAKEN = 'notTaken',
  DONE = 'done',
  DOING = 'doing',
}

/**
 * BaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: Partial<InitProps>): Promise<Entity>
  deleteAll(): Promise<DeleteResult>
  findOneById: FindByKey<Entity>
}

/**
 * to shorten the lines below
 */
type EGraph = IBaseRepo<IGraph, InitProps['Graph']>
type EUser = IBaseRepo<IUser, InitProps['User']>
type EDegree = IBaseRepo<IDegree, InitProps['Degree']>
type EModule = IBaseRepo<IModule, InitProps['Module']>
type EModuleCondensed = IBaseRepo<
  IModuleCondensed,
  InitProps['ModuleCondensed']
>

export interface IGraphRepository extends EGraph {
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
  findByIds(id: string[]): Promise<IGraph[]>
}

export interface IUserRepository extends EUser {
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

export interface IDegreeRepository extends EDegree {
  insertModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  findOneByTitle(title: string): Promise<IDegree>
  findByIds(id: string[]): Promise<IDegree[]>
}

export interface IModuleRepository extends EModule {
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

export interface IModuleCondensedRepository extends EModuleCondensed {
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
