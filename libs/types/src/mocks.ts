import type {
  Degree,
  User,
  Graph,
  Module,
  ModuleFull,
  ModuleCondensed,
} from './entities'
import type { DataSource } from 'typeorm'

export type FakeDataInit = {
  degree: Partial<Degree>[]
  user: Partial<User>[]
  module: Partial<Module>[]
  graph: Partial<Graph>[]
  moduleCondensed: Partial<ModuleCondensed>[]
  moduleFull: Partial<ModuleFull>[]
}

export interface IFakeData {
  degrees: Degree[]
  users: User[]
  modules: Module[]
  graphs: Graph[]
  modulesCondensed: ModuleCondensed[]
  modulesFull: ModuleFull[]
  findModuleByCode(moduleCode: string): Module
  create<T>(Entity: new () => T, params?: Partial<T>): T
}

export type FakeDataSource = DataSource & {
  fakeData: IFakeData
}
