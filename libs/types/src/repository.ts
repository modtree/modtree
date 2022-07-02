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

/**
 * Graph Repository Interface
 */
export interface IGraphRepository extends Repository<IGraph> {
  /**
   * initialize a new graph and save it to the database
   *
   * @param props
   * @returns graph
   */
  initialize(props: InitProps['Graph']): Promise<IGraph>
  /**
   * delete all graphs
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   * finds a graph by id
   *
   * @param id
   * @returns graph
   */
  findOneById(id: string): Promise<IGraph>
  /**
   *
   */
  toggleModule(graph: IGraph, moduleCode: string): Promise<IGraph>
  /**
   * finds a graph by user and degree id
   *
   * @param userId
   * @param degreeId
   * @returns graph
   */
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<IGraph>
  /**
   *
   */
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[IGraph[], number]>
  /**
   *
   */
  getSuggestModulesParams(
    graph: IGraph,
    modulesSelected: string[]
  ): Promise<[string[], string[], string[], string[]]>
  /**
   *
   */
  suggestModules(graph: IGraph, moduleCodes: string[]): Promise<IModule[]>
  /**
   *
   */
  updateFrontendProps(graph: IGraph, props: GraphFrontendProps): Promise<IGraph>
  /**
   *
   */
  updateFlowNode(graph: IGraph, node: FlowNode): Promise<IGraph>
  /**
   *
   */
  findByIds(id: string[]): Promise<IGraph[]>
}

/**
 * User Repository Interface
 */
export interface IUserRepository extends Repository<IUser> {
  /**
   * initialize a new user and save it to the database
   *
   * @param props
   * @returns user
   */
  initialize(props: InitProps['User']): Promise<IUser>
  /**
   * finds a user by id
   *
   * @param id
   * @returns user
   */
  findOneById(id: string): Promise<IUser>
  /**
   * delete all users
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   *
   */
  canTakeModule(user: IUser, moduleCode: string): Promise<boolean>
  /**
   * finds a user by username
   *
   * @param username
   * @returns user
   */
  findOneByUsername(username: string): Promise<IUser>
  /**
   * finds a user by auth0 id
   *
   * @param authZeroId
   * @returns user
   */
  findOneByAuthZeroId(authZeroId: string): Promise<IUser>
  /**
   * finds a user by email
   *
   * @param email
   * @returns user
   */
  findOneByEmail(email: string): Promise<IUser>
  /**
   *
   */
  getEligibleModules(user: IUser): Promise<IModule[]>
  /**
   *
   */
  getPostReqs(user: IUser): Promise<IModule[]>
  /**
   *
   */
  getUnlockedModules(user: IUser, moduleCode: string): Promise<IModule[]>
  /**
   *
   */
  hasTakenModule(user: IUser, moduleCode: string): Promise<boolean>
  /**
   *
   */
  filterTakenModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  /**
   *
   */
  setMainDegree(user: IUser, degreeId: string): Promise<IUser>
  /**
   *
   */
  insertDegrees(user: IUser, degreeIds: string[]): Promise<IUser>
  /**
   *
   */
  findDegree(user: IUser, degreeId: string): Promise<IDegree>
  /**
   *
   */
  removeDegree(user: IUser, degreeId: string): Promise<IUser>
  /**
   *
   */
  setModuleStatus(
    user: IUser,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<IUser>
  /**
   *
   */
  setMainGraph(user: IUser, graphId: string): Promise<IUser>
  /**
   *
   */
  insertGraphs(user: IUser, graphIds: string[]): Promise<IUser>
}

/**
 * Degree Repository Interface
 */
export interface IDegreeRepository extends Repository<IDegree> {
  /**
   * initialize a new degree and save it to the database
   *
   * @param props
   * @returns degree
   */
  initialize(props: InitProps['Degree']): Promise<IDegree>
  /**
   * finds a degree by id
   *
   * @param id
   * @returns degree
   */
  findOneById(id: string): Promise<IDegree>
  /**
   * delete all degrees
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   * insert modules into a degree
   *
   * @param degree
   * @param moduleCodes
   * @returns degree
   */
  insertModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  /**
   * finds a degree by title
   *
   * @param title
   * @returns degree
   */
  findOneByTitle(title: string): Promise<IDegree>
  /**
   * finds some degrees by ids
   *
   * @param id
   * @returns degrees
   */
  findByIds(id: string[]): Promise<IDegree[]>
}

/**
 * Module Repository Interface
 */
export interface IModuleRepository extends Repository<IModule> {
  /**
   * initialize a new module and save it to the database
   *
   * @param props
   * @returns module
   */
  initialize(props: InitProps['Module']): Promise<IModule>
  /**
   * finds a module by id
   *
   * @param id
   * @returns module
   */
  findOneById(id: string): Promise<IModule>
  /**
   * delete all modules
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   * lists all the module codes of modules in database
   *
   * @returns module codes
   */
  getCodes(): Promise<string[]>
  /**
   * finds some modules by codes
   *
   * @param moduleCodes
   * @returns module
   */
  findByCodes(moduleCodes: string[]): Promise<IModule[]>
  /**
   * checks if a module is take-able given the modules
   * that are already done/already doing
   *
   * @param modulesDone
   * @param modulesDoing
   * @param moduleCode
   * @returns a boolean
   */
  canTakeModule(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<boolean>
  /**
   * get a list of post-requisites
   *
   * @param moduleCodes
   * @returns module codes
   */
  getPostReqs(moduleCodes: string[]): Promise<string[]>
  /**
   * get a list of eligible modules
   *
   * @param modulesDone
   * @param modulesDoing
   * @param modulesSelected
   * @returns module codes
   */
  getEligibleModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[]
  ): Promise<string[]>
  /**
   * get a list of suggested modules
   *
   * @param modulesDone
   * @param modulesDoing
   * @param modulesSelected
   * @param requiredModules
   * @returns module codes
   */
  getSuggestedModules(
    modulesDone: string[],
    modulesDoing: string[],
    modulesSelected: string[],
    requiredModules: string[]
  ): Promise<string[]>
  /**
   * get a list of unlocked modules
   *
   * @param modulesDone
   * @param modulesDoing
   * @param moduleCode
   * @returns module codes
   */
  getUnlockedModules(
    modulesDone: string[],
    modulesDoing: string[],
    moduleCode: string
  ): Promise<string[]>
}

/**
 * ModuleCondensed Repository Interface
 */
export interface IModuleCondensedRepository
  extends Repository<IModuleCondensed> {
  /**
   * initialize a new condensed module and save it to the database
   *
   * @param props
   * @returns condensed module
   */
  initialize(props: InitProps['ModuleCondensed']): Promise<IModuleCondensed>
  /**
   * finds a condensed module by id
   *
   * @param id
   * @returns condensed module
   */
  findOneById(id: string): Promise<IModuleCondensed>
  /**
   * delete all condensed modules
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   * lists all the module codes of condensed modules in database
   *
   * @returns module codes
   */
  getCodes(): Promise<string[]>
  /**
   * finds some condensed modules by codes
   *
   * @param moduleCodes
   * @returns condensed module
   */
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]>
}

/**
 * ModuleFull Repository Interface
 */
export interface IModuleFullRepository extends Repository<IModuleFull> {
  /**
   * finds a full module by code
   *
   * @param code
   * @returns full module
   */
  findOneByCode(code: string): Promise<IModuleFull>
}

export type Repositories = {
  Module: IModuleRepository
  ModuleFull: IModuleFullRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}
