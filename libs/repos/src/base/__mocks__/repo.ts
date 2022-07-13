import { jest } from '@jest/globals'
import { BaseRepo as Original } from '../repo'
import {
  User,
  Degree,
  Graph,
  Module,
  ModuleCondensed,
  ModuleFull,
} from '@modtree/types'
import {
  DataSource,
  EntityMetadata,
  EntityTarget,
  DeepPartial,
  EntityManager,
  FindManyOptions,
  Repository as TypeORMRepository,
} from 'typeorm'
import mockRelations from './relations.json'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'

const whip = <T>(e: any) => e as T
const assign = <T>(C: new () => any, e: DeepPartial<T>) =>
  whip<T>(Object.assign(new C(), e))

jest.mock('typeorm', () => {
  const A = jest.requireActual('typeorm') as any
  const TR = A.Repository as typeof TypeORMRepository
  class Repository<Entity> extends TR<Entity> {
    private coerce = (e: DeepPartial<Entity>): Entity => {
      if (this.target === Module) return assign(Module, e)
      if (this.target === ModuleCondensed) return assign(ModuleCondensed, e)
      if (this.target === ModuleFull) return assign(ModuleFull, e)
      if (this.target === Degree) return assign(Degree, e)
      if (this.target === User) return assign(User, e)
      if (this.target === Graph) return assign(Graph, e)
      return whip(e)
    }
    /**
     * create -> coerce inputs into an Entity
     */
    override create(): Entity
    override create(e: DeepPartial<Entity>[]): Entity[]
    override create(e: DeepPartial<Entity>): Entity
    override create(
      e?: DeepPartial<Entity> | DeepPartial<Entity>[]
    ): Entity | Entity[] {
      if (e === undefined) return []
      return Array.isArray(e) ? e.map(this.coerce) : this.coerce(e)
    }
    /**
     * save -> coerce inputs into a deep partial of the Entity
     */
    override async save<T extends DeepPartial<Entity>>(
      e: T | T[]
    ): Promise<T | T[]> {
      return Array.isArray(e)
        ? (e.map(this.coerce) as T[])
        : (this.coerce(e) as T)
    }
    override find = async (_?: FindManyOptions<Entity>): Promise<Entity[]> => []
    constructor(entity: EntityTarget<Entity>, manager: EntityManager) {
      super(entity, manager)
    }
  }
  return {
    ...A,
    Repository,
  }
})

const mapPropertyName = (arr: string[]) => arr.map((p) => ({ propertyName: p }))

const getFakeRelations = <T>(entity: EntityTarget<T>): RelationMetadata[] => {
  let arr: string[] = []
  if (entity === Degree) arr = mockRelations.degree
  if (entity === User) arr = mockRelations.user
  if (entity === Graph) arr = mockRelations.graph
  return mapPropertyName(arr) as RelationMetadata[]
}

export class BaseRepo<Entity extends { id: string }> extends Original<Entity> {
  constructor(entity: EntityTarget<Entity>, db: DataSource) {
    /** mock relations */
    db.manager.connection.getMetadata = () =>
      ({ relations: getFakeRelations(entity) } as EntityMetadata)
    super(entity, db)
  }
}
