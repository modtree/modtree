import { Repository } from 'typeorm'
import { InitProps } from './init-props'
import { Graph, User, Degree, Module, ModuleCondensed } from '../src/entity'

/**
 * IBaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: InitProps): Promise<Entity>
  deleteAll(): Promise<void>
  findOneById: (value: string) => Promise<Entity>
}

export interface IGraphRepository extends IBaseRepo<Graph, InitProps['Graph']> {
  toggleModule(graph: Graph, moduleCode: string): Promise<Graph>
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<Graph>
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]>
  suggestModulesFromOne(graph: Graph, moduleCode: string): Promise<Module[]>
}

export interface IUserRepository extends IBaseRepo<User, InitProps['User']> {
  canTakeModule(
    user: User,
    moduleCode: string,
    addModuleCodes: string[]
  ): Promise<boolean>
  findOneByUsername(username: string): Promise<User>
  getEligibleModules(user: User, addModuleCodes: string[]): Promise<Module[]>
  getPostReqs(user: User, addModuleCodes: string[]): Promise<Module[]>
  getUnlockedModules(user: User, moduleCode: string): Promise<Module[]>
  hasTakenModule(user: User, moduleCode: string): Promise<boolean>
  filterTakenModules(user: User, moduleCodes: string[]): Promise<string[]>
  addDegree(user: User, degreeId: string): Promise<void>
  findDegree(user: User, degreeId: string): Promise<Degree>
  removeDegree(user: User, degreeId: string): Promise<void>
}

export interface IDegreeRepository
  extends IBaseRepo<Degree, InitProps['Degree']> {
  insertModules(degree: Degree, moduleCodes: string[]): Promise<Degree>
  findOneByTitle(title: string): Promise<Degree>
  findByIds(id: string[]): Promise<Degree[]>
}

export interface IModuleRepository
  extends IBaseRepo<Module, InitProps['Module']> {
  fetchOne(moduleCode: string): Promise<Module>
  getCodes(): Promise<string[]>
  pull(): Promise<Module[]>
  findByFaculty(faculty: string): Promise<Module[]>
  findByCodes(moduleCodes: string[]): Promise<Module[]>
}

export interface IModuleCondensedRepository
  extends IBaseRepo<ModuleCondensed, InitProps['ModuleCondensed']> {
  pull(): Promise<ModuleCondensed[]>
  fetch(): Promise<ModuleCondensed[]>
  getCodes(): Promise<string[]>
  deleteAll(): Promise<void>
}

export type Repositories = Partial<{
  Module: IModuleRepository
  ModuleCondensed: IModuleCondensedRepository
  User: IUserRepository
  Degree: IDegreeRepository
  Graph: IGraphRepository
}>
