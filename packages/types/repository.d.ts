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
 * IBaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface IBaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize(props: InitProps): Promise<Entity>
  deleteAll(): Promise<void>
  findOneById: (value: string) => Promise<Entity>
}

export interface IIGraphRepository
  extends IBaseRepo<IGraph, InitProps['Graph']> {
  toggleIModule(graph: IGraph, moduleCode: string): Promise<IGraph>
  findOneByIUserAndIDegreeId(userId: string, degreeId: string): Promise<IGraph>
  findManyByIUserAndIDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[IGraph[], number]>
  suggestIModules(
    graph: IGraph,
    moduleCodes: string[],
    addIUserIModulesDone: boolean
  ): Promise<IModule[]>
}

export interface IIUserRepository extends IBaseRepo<IUser, InitProps['User']> {
  canTakeIModule(
    user: IUser,
    moduleCode: string,
    addIModuleCodes: string[],
    addIUserIModulesDone: boolean
  ): Promise<boolean>
  findOneByIUsername(username: string): Promise<IUser>
  getEligibleIModules(
    user: IUser,
    addIModuleCodes: string[]
  ): Promise<IModule[]>
  getPostReqs(
    user: IUser,
    addIModuleCodes: string[],
    addIUserIModulesDone: boolean
  ): Promise<IModule[]>
  getUnlockedIModules(user: IUser, moduleCode: string): Promise<IModule[]>
  hasTakenIModule(user: IUser, moduleCode: string): Promise<boolean>
  filterTakenIModules(user: IUser, moduleCodes: string[]): Promise<string[]>
  addIDegree(user: IUser, degreeId: string): Promise<void>
  findIDegree(user: IUser, degreeId: string): Promise<IDegree>
  removeIDegree(user: IUser, degreeId: string): Promise<void>
}

export interface IIDegreeRepository
  extends IBaseRepo<IDegree, InitProps['Degree']> {
  insertIModules(degree: IDegree, moduleCodes: string[]): Promise<IDegree>
  findOneByTitle(title: string): Promise<IDegree>
  findByIds(id: string[]): Promise<IDegree[]>
}

export interface IIModuleRepository
  extends IBaseRepo<IModule, InitProps['Module']> {
  fetchOne(moduleCode: string): Promise<IModule>
  getCodes(): Promise<string[]>
  pull(): Promise<IModule[]>
  findByFaculty(faculty: string): Promise<IModule[]>
  findByCodes(moduleCodes: string[]): Promise<IModule[]>
}

export interface IIModuleCondensedRepository
  extends IBaseRepo<IModuleCondensed, InitProps['ModuleCondensed']> {
  pull(): Promise<IModuleCondensed[]>
  fetch(): Promise<IModuleCondensed[]>
  getCodes(): Promise<string[]>
  deleteAll(): Promise<void>
}

export type Repositories = Partial<{
  IModule: IIModuleRepository
  IModuleCondensed: IIModuleCondensedRepository
  IUser: IIUserRepository
  IDegree: IIDegreeRepository
  IGraph: IIGraphRepository
}>
