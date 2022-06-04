import { Repository, FindOptionsRelations } from 'typeorm'
import type * as InitProps from './init-props'
import type {
  Graph,
  User,
  Degree,
  Module,
  ModuleCondensed,
} from '../src/entity'
import type { Module as NM, ModuleCondensed as NMC } from './nusmods'

type LoadRelations<Entity> = (
  entity: Entity,
  relations: FindOptionsRelations<Entity>
) => Promise<void>

/**
 * BaseRepository, but for now only in types
 * it is a interface that will be extended to form the final Repositories of modtree
 */
interface BaseRepo<Entity, InitProps> extends Repository<Entity> {
  initialize?(props: InitProps): Promise<Entity>
  deleteAll?(): Promise<void>
}

export interface GraphRepository extends BaseRepo<Graph, InitProps.Graph> {
  toggleModule(graph: Graph, moduleCode: string): Promise<void>
  loadRelations: LoadRelations<Graph>
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<Graph>
  findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]>
  suggestModulesFromOne(graph: Graph, moduleCode: string): Promise<Module[]>
}

export interface UserRepository extends BaseRepo<User, InitProps.User> {
  canTakeModule(
    user: User,
    moduleCode: string,
    addModuleCodes?: string[]
  ): Promise<boolean>
  loadRelations: LoadRelations<User>
  findOneByUsername(username: string): Promise<User>
  eligibleModules(user: User, addModuleCodes?: string[]): Promise<Module[]>
  getPostReqs(user: User, addModuleCodes?: string[]): Promise<Module[]>
  getUnlockedModules(user: User, moduleCode: string): Promise<Module[]>
  findOneById(id: string): Promise<User>
  addDegree(user: User, degreeId: string): Promise<void>
  findDegree(user: User, degreeId: string): Promise<Degree>
  removeDegree(user: User, degreeId: string): Promise<void>
}

export interface DegreeRepository extends BaseRepo<Degree, InitProps.Degree> {
  insertModules(degree: Degree, moduleCodes: string[]): Promise<void>
  loadRelations: LoadRelations<Degree>
  findOneByTitle(title: string): Promise<Degree>
  findOneById(id: string): Promise<Degree>
  findByIds(id: string[]): Promise<Degree[]>
}

export interface ModuleRepository extends BaseRepo<Module, NM> {
  get(): Promise<Module[]>
  fetchOne(moduleCode: string): Promise<Module>
  getCodes(): Promise<string[]>
  pull(): Promise<Module[]>
  findByFaculty(faculty: string): Promise<Module[]>
  loadRelations: LoadRelations<Module>
  findByCodes(moduleCodes: string[]): Promise<Module[]>
}

export interface ModuleCondensedRepository
  extends BaseRepo<ModuleCondensed, NMC> {
  pull(): Promise<ModuleCondensed[]>
  fetch(): Promise<ModuleCondensed[]>
  getCodes(): Promise<string[]>
  loadRelations: LoadRelations<ModuleCondensed>
  deleteAll(): Promise<void>
}
