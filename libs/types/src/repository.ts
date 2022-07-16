import { DeepPartial, DeleteResult, Repository } from 'typeorm'
import {
  IGraph,
  IUser,
  IDegree,
  IModule,
  IModuleFull,
  IModuleCondensed,
  GraphFrontendProps,
  GraphFlowNode,
} from './entities'
import {
  InitDegreeProps,
  InitGraphProps,
  InitModuleCondensedProps,
  InitModuleProps,
  InitUserProps,
} from './init-props'

export type FindByKey<T> = (query: string) => Promise<T>
export type Relations = Record<string, boolean>

/**
 * types for module status
 */
export enum ModuleStatus {
  NOT_TAKEN = 'notTaken',
  DONE = 'done',
  DOING = 'doing',
}
export type ModuleState = 'placed' | 'hidden' | 'new'

/**
 * types for canTakeModules
 */
export type CanTakeModuleMap = Record<string, boolean>
export type ModuleSources = {
  done: string[]
  doing: string[]
  planned: string[]
}

export interface IBaseRepository<Entity> {
  relations: Relations
  /** direct inheritance */
  create: Repository<Entity>['create']
  save(e: DeepPartial<Entity>): Promise<Entity>
  save(e: DeepPartial<Entity>[]): Promise<Entity[]>
  count: Repository<Entity>['count']
  findAndCount: Repository<Entity>['findAndCount']
  remove: Repository<Entity>['remove']
  delete: Repository<Entity>['delete']
  find: Repository<Entity>['find']
  findOne: Repository<Entity>['findOneOrFail']
  createQueryBuilder: Repository<Entity>['createQueryBuilder']
  /** derivative methods */
  findOneById(id: string): Promise<Entity>
  findByIds(ids: string[]): Promise<Entity[]>
}

/**
 * Graph Repository Interface
 */
export interface IGraphRepository extends IBaseRepository<IGraph> {
  /**
   * initialize a new graph and save it to the database
   *
   * @param props
   * @returns graph
   */
  initialize(props: InitGraphProps): Promise<IGraph>
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
   * toggle the state of a module in a graph
   *
   * @param graph
   * @param moduleCode
   * @returns graph
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
   * lists graphs by user id and degree id
   *
   * @param userId
   * @param degreeId
   * @returns graph list and its count
   */
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[IGraph[], number]>
  /**
   * preparatory function for getSuggestedModules
   *
   * @param graph
   * @param modulesSelected
   */
  getSuggestModulesParams(
    graph: IGraph,
    modulesSelected: string[]
  ): Promise<[string[], string[], string[], string[]]>
  /**
   * suggest a list of modules to take next
   *
   * @param graph
   * @param moduleCodes
   * @returns modules
   */
  suggestModules(graph: IGraph, moduleCodes: string[]): Promise<IModule[]>
  /**
   * update frontend props of a graph
   *
   * @param graph
   * @param props
   * @returns graph
   */
  updateFrontendProps(graph: IGraph, props: GraphFrontendProps): Promise<IGraph>
  /**
   * updates one flow node of a graph
   *
   * @param graph
   * @param node
   * @returns graph
   */
  updateFlowNode(graph: IGraph, node: GraphFlowNode): Promise<IGraph>
  /**
   * checks if graph contains enough pre-reqs to take a module
   *
   * @param graph
   * @param moduleCode
   * @returns boolean
   */
  canTakeModule(graph: IGraph, moduleCode: string): Promise<boolean>
  /**
   * multiple canTakeModule
   *
   * @param graph
   * @returns a boolean
   */
  canTakeModules(graph: IGraph): Promise<CanTakeModuleMap>
  /**
   * finds graphs by ids
   *
   * @param id
   * @returns graphs
   */
  findByIds(id: string[]): Promise<IGraph[]>
}

/**
 * User Repository Interface
 */
export interface IUserRepository extends IBaseRepository<IUser> {
  /**
   * initialize a new user and save it to the database
   *
   * @param props
   * @returns user
   */
  initialize(props: InitUserProps): Promise<IUser>
  /**
   * finds a user by id
   *
   * @param id
   * @returns user
   */
  findOneById(id: string): Promise<IUser>
  /**
   * finds a user full by id
   *
   * @param id
   * @returns user
   */
  findOneFullById(id: string): Promise<IUser>
  /**
   * delete all users
   *
   * @returns delete result
   */
  deleteAll(): Promise<DeleteResult>
  /**
   * checks if a user can take a module
   *
   * @param user
   * @param moduleCode
   * @returns boolean
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
   * gets a user's eligible modules
   *
   * @param user
   * @returns modules
   */
  getEligibleModules(user: IUser): Promise<IModule[]>
  /**
   * get all the post-requisites of the user's done/doing modules
   *
   * @param user
   * @returns modules
   */
  getPostReqs(user: IUser): Promise<IModule[]>
  /**
   * get all the user's unlocked module after completing one particular module
   *
   * @param user
   * @param moduleCode
   * @returns module
   */
  getUnlockedModules(user: IUser, moduleCode: string): Promise<IModule[]>
  /**
   * checks if the user has taken a module
   *
   * @param user
   * @param moduleCode
   * @returns boolean
   */
  hasTakenModule(user: IUser, moduleCode: string): Promise<boolean>
  /**
   * filters a user's taken modules
   *
   * @param user
   * @param moduleCodes
   * @returns module cdoes
   */
  filterTakenModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  /**
   * sets a user's main degree
   *
   * @param user
   * @param degreeId
   * @returns user
   */
  setMainDegree(user: IUser, degreeId: string): Promise<IUser>
  /**
   * inserts some degrees to a user's list of saved degrees
   *
   * @param user
   * @param degreeIds
   * @returns user
   */
  insertDegrees(user: IUser, degreeIds: string[]): Promise<IUser>
  /**
   * finds a degree within a user
   *
   * @param user
   * @param degreeId
   * @returns degree
   */
  findDegree(user: IUser, degreeId: string): Promise<IDegree>
  /**
   * removes a degree from a user's list of saved degrees
   *
   * @param user
   * @param degreeId
   * @returns user
   */
  removeDegree(user: IUser, degreeId: string): Promise<IUser>
  /**
   * sets the status of some modules of a user
   *
   * @param user
   * @param moduleCodes
   * @param status
   * @returns user
   */
  setModuleStatus(
    user: IUser,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<IUser>
  /**
   * sets the main graph of the user
   *
   * @param user
   * @param graphId
   * @returns user
   */
  setMainGraph(user: IUser, graphId: string): Promise<IUser>
  /**
   * inserts some graphs to the user's list of saved graphs
   *
   * @param user
   * @param graphIds
   * @returns user
   */
  insertGraphs(user: IUser, graphIds: string[]): Promise<IUser>
}

/**
 * Degree Repository Interface
 */
export interface IDegreeRepository extends IBaseRepository<IDegree> {
  /**
   * initialize a new degree and save it to the database
   *
   * @param props
   * @returns degree
   */
  initialize(props: InitDegreeProps): Promise<IDegree>
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
   * modifies a degree
   *
   * @param degree
   * @param props
   * @returns degree
   */
  update(degree: IDegree, props: InitDegreeProps): Promise<IDegree>
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
export interface IModuleRepository extends IBaseRepository<IModule> {
  /**
   * initialize a new module and save it to the database
   *
   * @param props
   * @returns module
   */
  initialize(props: InitModuleProps): Promise<IModule>
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
   * finds one module by code
   *
   * @param moduleCode
   * @returns module
   */
  findByCode(moduleCode: string): Promise<IModule>
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
  extends IBaseRepository<IModuleCondensed> {
  /**
   * initialize a new condensed module and save it to the database
   *
   * @param props
   * @returns condensed module
   */
  initialize(props: InitModuleCondensedProps): Promise<IModuleCondensed>
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
   * @returns condensed modules
   */
  findByCodes(moduleCodes: string[]): Promise<IModuleCondensed[]>
  /**
   * finds one condensed module by code
   *
   * @param moduleCode
   * @returns condensed module
   */
  findByCode(moduleCode: string): Promise<IModuleCondensed>
}

/**
 * ModuleFull Repository Interface
 */
export interface IModuleFullRepository extends IBaseRepository<IModuleFull> {
  /**
   * finds a full module by code
   *
   * @param code
   * @returns full module
   */
  findByCode(code: string): Promise<IModuleFull>
  /**
   * finds some full modules by codes
   *
   * @param moduleCodes
   * @returns full modules
   */
  findByCodes(moduleCodes: string[]): Promise<IModuleFull[]>
}

export type Repositories = {
  Module: IModuleRepository
  ModuleFull: IModuleFullRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}
