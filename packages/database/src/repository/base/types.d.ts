import { ObjectLiteral, FindOptionsRelations } from 'typeorm'

export type EntityConstructor<T extends ObjectLiteral> = new () => T

export type EntityInstance<T> = EntityConstructor<T> & { id: string }

export type LoadRelations<Entity> = (
  entity: Entity,
  relations: FindOptionsRelations<Entity>
) => Promise<void>
