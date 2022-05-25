import { ObjectLiteral } from 'typeorm'

export type EntityConstructor<T extends ObjectLiteral> = new () => T

export type EntityInstance<T> = EntityConstructor<T> & { id: string }

export type LoadRelations<T> = (
  entity: T,
  relations: FindOptionsRelations<T>
) => Promise<void>
