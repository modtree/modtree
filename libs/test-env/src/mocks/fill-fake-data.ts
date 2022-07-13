import {
  Degree,
  User,
  Graph,
  Module,
  ModuleFull,
  ModuleCondensed,
  EntityName,
} from '@modtree/types'

const entityMap: Record<EntityName, new () => any> = {
  user: User,
  graph: Graph,
  degree: Degree,
  module: Module,
  moduleFull: ModuleFull,
  moduleCondensed: ModuleCondensed,
}

export function fillFakeData<T>(entityName: EntityName, data: any[] = []): T[] {
  return data.map((partialData) => {
    const entity = Object.assign(new entityMap[entityName](), partialData)
    if (entityName.startsWith('module')) {
      Object.assign(entity, {
        fulfillRequirements: partialData.fulfillRequirements || [],
      })
    }
    return entity
  })
}
