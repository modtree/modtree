import {
  Module,
  FakeDataSource,
  FakeDataInit,
  Degree,
  Graph,
  User,
  ModuleCondensed,
  ModuleFull,
  IFakeData,
} from '@modtree/types'
import { DataSource } from 'typeorm'

class FakeData implements IFakeData {
  /**
   * data
   */
  data: FakeDataInit
  modules: Module[]
  modulesCondensed: ModuleCondensed[]
  modulesFull: ModuleFull[]
  degrees: Degree[]
  users: User[]
  graphs: Graph[]

  /** instantiate fake data */
  constructor(data: Partial<FakeDataInit> = {}) {
    this.data = {
      module: data.module || [],
      user: data.user || [],
      graph: data.graph || [],
      degree: data.degree || [],
      moduleFull: data.moduleFull || [],
      moduleCondensed: data.moduleCondensed || [],
    }
    this.modules = this.setModules()
    this.modulesFull = this.setModulesFull()
    this.modulesCondensed = this.setModulesCondensed()
    this.degrees = this.setDegrees()
    this.users = this.setUsers()
    this.graphs = this.setGraphs()
  }

  /**
   * maps any array to a typed array based on an entity constructor
   */
  private map<T>(
    data: any[],
    Entity: new () => T,
    assign?: (_: Partial<T>) => Partial<T>
  ): T[] {
    return data.map((partialData) =>
      Object.assign(new Entity(), {
        ...partialData,
        ...(assign ? assign(partialData) : undefined),
      })
    ) as T[]
  }

  /** fill fake modules */
  setModules(): Module[] {
    return this.map(this.data.module, Module)
  }

  /** fill fake degrees */
  setDegrees(): Degree[] {
    return this.map(this.data.degree, Degree)
  }

  /** fill fake graphs */
  setGraphs(): Graph[] {
    return this.map(this.data.graph, Graph)
  }

  /** fill fake users */
  setUsers(): User[] {
    return this.map(this.data.user, User)
  }

  /** fill fake condensed modules */
  setModulesCondensed(): ModuleCondensed[] {
    return this.map(this.data.moduleCondensed, ModuleCondensed)
  }

  /** fill fake full modules */
  setModulesFull(): ModuleFull[] {
    return this.map(this.data.moduleFull, ModuleFull)
  }

  create<T>(Entity: new () => T, params?: Partial<T>): T {
    return Object.assign(new Entity(), params)
  }

  /**
   * This section contains mock functions, meant to be used in mock
   * repositories.
   */

  /** find a module by a module code */
  findModuleByCode(moduleCode: string): Module {
    const result = this.modules.find((m) => m.moduleCode === moduleCode)
    if (!result) return this.create(Module, { moduleCode })
    return result
  }
}

export function getDb(fakeData?: Partial<FakeDataInit>): FakeDataSource {
  const db = new DataSource({
    database: 'mock',
    type: 'postgres',
  }) as any
  db.fakeData = new FakeData(fakeData)
  return db
}

export const db = getDb()
