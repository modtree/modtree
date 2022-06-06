import { Repository } from 'typeorm'
import type * as InitProps from './init-props'
import type {
  Graph,
  User,
  Degree,
  Module,
  ModuleCondensed,
} from '../src/entity'
import type { Module as NM, ModuleCondensed as NMC } from './nusmods'

/**
 * IBaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: InitProps): Promise<Entity>
  deleteAll(): Promise<void>
}

export interface IGraphRepository extends IBaseRepo<Graph, InitProps.Graph> {
  findOneById(id: string): Promise<Graph>
  toggleModule(graph: Graph, moduleCode: string): Promise<void>
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<Graph>
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]>
  suggestModulesFromOne(graph: Graph, moduleCode: string): Promise<Module[]>
}

export interface IUserRepository extends IBaseRepo<User, InitProps.User> {
  canTakeModule(
    user: User,
    moduleCode: string,
    addModuleCodes?: string[]
  ): Promise<boolean>
  findOneByUsername(username: string): Promise<User>
  getEligibleModules(user: User, addModuleCodes?: string[]): Promise<Module[]>
  getPostReqs(user: User, addModuleCodes?: string[]): Promise<Module[]>
  getUnlockedModules(user: User, moduleCode: string): Promise<Module[]>
  findOneById(id: string): Promise<User>
  addDegree(user: User, degreeId: string): Promise<void>
  findDegree(user: User, degreeId: string): Promise<Degree>
  removeDegree(user: User, degreeId: string): Promise<void>
}

export interface IDegreeRepository extends IBaseRepo<Degree, InitProps.Degree> {
  insertModules(degree: Degree, moduleCodes: string[]): Promise<void>
  findOneByTitle(title: string): Promise<Degree>
  findOneById(id: string): Promise<Degree>
  findByIds(id: string[]): Promise<Degree[]>
}

export interface IModuleRepository extends IBaseRepo<Module, NM> {
  get(): Promise<Module[]>
  fetchOne(moduleCode: string): Promise<Module>
  getCodes(): Promise<string[]>
  pull(): Promise<Module[]>
  findByFaculty(faculty: string): Promise<Module[]>
  findByCodes(moduleCodes: string[]): Promise<Module[]>
}

export interface IModuleCondensedRepository
  extends IBaseRepo<ModuleCondensed, NMC> {
  pull(): Promise<ModuleCondensed[]>
  fetch(): Promise<ModuleCondensed[]>
  getCodes(): Promise<string[]>
  deleteAll(): Promise<void>
}
