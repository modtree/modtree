import {
  Degree,
  User,
  Graph,
  Module,
  ModuleFull,
  ModuleCondensed,
  EntityName,
  PartialRecord,
  FakeDataSource,
  FakeDataInit,
  FullRecord,
} from '@modtree/types'
import { DataSource } from 'typeorm'

const entityMap: Record<EntityName, new () => any> = {
  user: User,
  graph: Graph,
  degree: Degree,
  module: Module,
  moduleFull: ModuleFull,
  moduleCondensed: ModuleCondensed,
}

function fillFakeData<T>(
  entityName: EntityName,
  data?: PartialRecord<T>
): FullRecord<T> {
  if (!data) return {}
  const result: Record<string, T> = {}
  Object.entries(data || {}).forEach(([key, value]) => {
    const entity = Object.assign(new entityMap[entityName](), value)
    /**
     * module code clutch
     */
    if (entityName.startsWith('module'))
      Object.assign(entity, { moduleCode: key })
    result[key] = entity
  })
  return result
}

export function getDb(fakeData?: FakeDataInit): FakeDataSource {
  const db = new DataSource({
    database: 'mock',
    type: 'postgres',
  }) as any
  db.fakeData = {
    module: fillFakeData('module', fakeData?.module),
    degree: fillFakeData('degree', fakeData?.degree),
    user: fillFakeData('user', fakeData?.user),
    graph: fillFakeData('graph', fakeData?.graph),
  }
  return db
}

export const db = getDb()
