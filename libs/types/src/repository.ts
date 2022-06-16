import { Repository } from 'typeorm'
import { InitProps } from './init-props'
import {
  IGraph,
  IUser,
  IDegree,
  IModule,
  IModuleCondensed,
  GraphFrontendProps,
} from './entity-interface'

export type FindByKey<T> = (query: string) => Promise<T>

export enum ModuleStatus {
  NOT_TAKEN = 0,
  DONE = 1,
  DOING = 2,
}

/**
 * BaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: InitProps): Promise<Entity>
  deleteAll(): Promise<void>
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
}

export interface IUserRepository extends EUser {
  canTakeModule(user: IUser, moduleCode: string): Promise<boolean>
  findOneByUsername(username: string): Promise<IUser>
  findOneByEmail(email: string): Promise<IUser>
  getEligibleModules(user: IUser): Promise<IModule[]>
  getPostReqs(user: IUser): Promise<IModule[]>
  getUnlockedModules(user: IUser, moduleCode: string): Promise<IModule[]>
  hasTakenModule(user: IUser, moduleCode: string): Promise<boolean>
  filterTakenModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  addDegree(user: IUser, degreeId: string): Promise<IUser>
  findDegree(user: IUser, degreeId: string): Promise<IDegree>
  removeDegree(user: IUser, degreeId: string): Promise<IUser>
  setModuleStatus(
    user: IUser,
    moduleCode: string,
    status: ModuleStatus
  ): Promise<IUser>
}

export interface IDegreeRepository extends EDegree {
  insertModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  findOneByTitle(title: string): Promise<IDegree>
  findByIds(id: string[]): Promise<IDegree[]>
}

export interface IModuleRepository extends EModule {
  fetchOne(moduleCode: string): Promise<IModule>
  getCodes(): Promise<string[]>
  pull(): Promise<IModule[]>
  findByFaculty(faculty: string): Promise<IModule[]>
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
  pull(): Promise<IModuleCondensed[]>
  fetch(): Promise<IModuleCondensed[]>
  getCodes(): Promise<string[]>
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]>
}

export type Repositories = Partial<{
  Module: IModuleRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}>
