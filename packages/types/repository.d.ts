import { Repository } from 'typeorm'
import { InitProps } from './init-props'
import {
  IGraph,
  IUser,
  IDegree,
  IModule,
  IModuleCondensed,
} from './entity-interface'

/**
 * BaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: InitProps): Promise<Entity>
  deleteAll(): Promise<void>
  findOneById: (value: string) => Promise<Entity>
}

export interface IGraphRepository
  extends IBaseRepo<IGraph, InitProps['Graph']> {
  toggleModule(graph: IGraph, moduleCode: string): Promise<IGraph>
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<IGraph>
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[IGraph[], number]>
  suggestModules(
    graph: IGraph,
    moduleCodes: string[],
    addUserModulesDone: boolean
  ): Promise<IModule[]>
}

export interface IUserRepository extends IBaseRepo<IUser, InitProps['User']> {
  canTakeModule(
    user: IUser,
    moduleCode: string,
    addModuleCodes: string[],
    addUserModulesDone: boolean
  ): Promise<boolean>
  findOneByUsername(username: string): Promise<IUser>
  getEligibleModules(user: IUser, addModuleCodes: string[]): Promise<IModule[]>
  getPostReqs(
    user: IUser,
    addModuleCodes: string[],
    addUserModulesDone: boolean
  ): Promise<IModule[]>
  getUnlockedModules(user: IUser, moduleCode: string): Promise<IModule[]>
  hasTakenModule(user: IUser, moduleCode: string): Promise<boolean>
  filterTakenModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  addDegree(user: IUser, degreeId: string): Promise<void>
  findDegree(user: IUser, degreeId: string): Promise<IDegree>
  removeDegree(user: IUser, degreeId: string): Promise<void>
}

export interface IDegreeRepository
  extends IBaseRepo<IDegree, InitProps['Degree']> {
  insertModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  findOneByTitle(title: string): Promise<IDegree>
  findByIds(id: string[]): Promise<IDegree[]>
}

export interface IModuleRepository
  extends IBaseRepo<IModule, InitProps['Module']> {
  fetchOne(moduleCode: string): Promise<IModule>
  getCodes(): Promise<string[]>
  pull(): Promise<IModule[]>
  findByFaculty(faculty: string): Promise<IModule[]>
  findByCodes(moduleCodes: string[]): Promise<IModule[]>
}

export interface IModuleCondensedRepository
  extends IBaseRepo<IModuleCondensed, InitProps['ModuleCondensed']> {
  pull(): Promise<IModuleCondensed[]>
  fetch(): Promise<IModuleCondensed[]>
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
