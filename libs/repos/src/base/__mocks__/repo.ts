import { BaseRepo as Original } from '../repo'
import {
  User,
  Degree,
  Graph,
  Module,
  EntityTarget,
  ModuleCondensed,
  ModuleFull,
  FakeDataSource,
} from '@modtree/types'
import { EntityMetadata, DeepPartial } from 'typeorm'
import mockRelations from './relations.json'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'

const whip = <T>(e: any) => e as T
const assign = <T>(C: new () => any, e: DeepPartial<T>) =>
  whip<T>(Object.assign(new C(), e))

const mapPropertyName = (arr: string[]) => arr.map((p) => ({ propertyName: p }))

const sameName = (a: Function, b: Function) => a.name === b.name

const getFakeRelations = <T>(entity: EntityTarget<T>): RelationMetadata[] => {
  let arr: string[] = []
  const isTarget = (e: Function) => sameName(entity, e)
  if (isTarget(Degree)) arr = mockRelations.degree
  if (isTarget(User)) arr = mockRelations.user
  if (isTarget(Graph)) arr = mockRelations.graph
  return mapPropertyName(arr) as RelationMetadata[]
}

export class BaseRepo<Entity extends { id: string }> extends Original<Entity> {
  private database: Entity[]
  private isTarget = (e: Function) => sameName(this.target, e)

  constructor(entity: EntityTarget<Entity>, db: FakeDataSource) {
    /** mock relations */
    db.manager.connection.getMetadata = () => {
      const relations = getFakeRelations(entity)
      return { relations } as EntityMetadata
    }
    super(entity, db)
    if (this.isTarget(Module)) this.setDb(db.fakeData.modules)
    if (this.isTarget(Degree)) this.setDb(db.fakeData.degrees)
    if (this.isTarget(Graph)) this.setDb(db.fakeData.graphs)
    if (this.isTarget(User)) this.setDb(db.fakeData.users)
    if (this.isTarget(ModuleFull)) this.setDb(db.fakeData.modulesFull)
    if (this.isTarget(ModuleCondensed)) this.setDb(db.fakeData.modulesCondensed)
  }

  private setDb(data: any[]) {
    this.database = data as unknown as Entity[]
  }

  private coerce = (e: DeepPartial<Entity>): Entity => {
    if (this.isTarget(Module)) return assign(Module, e)
    if (this.isTarget(ModuleCondensed)) return assign(ModuleCondensed, e)
    if (this.isTarget(ModuleFull)) return assign(ModuleFull, e)
    if (this.isTarget(Degree)) return assign(Degree, e)
    if (this.isTarget(User)) return assign(User, e)
    if (this.isTarget(Graph)) return assign(Graph, e)
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

  override async findOneById(id: string): Promise<Entity> {
    return new Promise((resolve, reject) => {
      const result = this.database.find((e) => e.id === id)
      if (!result) {
        reject()
      } else {
        resolve(result)
      }
    })
  }

  override async findByIds(ids: string[]): Promise<Entity[]> {
    return new Promise((resolve, reject) => {
      const results = ids
        .map((id) => this.database.find((e) => e.id === id))
        .filter((x) => x !== undefined) as Entity[]
      if (!results) {
        reject()
      } else {
        resolve(results)
      }
    })
  }
}
