import type {
  Degree,
  User,
  Graph,
  Module,
  ModuleFull,
  ModuleCondensed,
} from './entities'
import type { DataSource } from 'typeorm'

export type PartialRecord<T> = Record<string, Partial<T>>
export type FullRecord<T> = Record<string, T>

export type FakeDataInit = Partial<{
  degree: PartialRecord<Degree>
  user: PartialRecord<User>
  module: PartialRecord<Module>
  graph: PartialRecord<Graph>
  moduleCondensed: PartialRecord<ModuleCondensed>
  moduleFull: PartialRecord<ModuleFull>
}>

export type FakeData = {
  degree: FullRecord<Degree>
  user: FullRecord<User>
  module: FullRecord<Module>
  graph: FullRecord<Graph>
  moduleCondensed: FullRecord<ModuleCondensed>
  moduleFull: FullRecord<ModuleFull>
}

export type FakeDataSource = DataSource & {
  fakeData: FakeData
}
