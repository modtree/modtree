import { DataSource, FindOptionsRelations, Repository } from 'typeorm'
import { db as DefaultSource } from '../config'
import { ModtreeEntity } from '../entity'
import { createEmpty } from '../utils/object'

type LoadRelationsMethod = (
  entity: ModtreeEntity,
  relations: FindOptionsRelations<ModtreeEntity>
) => Promise<void>

export type LoadRelations<T> = (
  entity: T,
  relations: FindOptionsRelations<T>
) => Promise<void>

/**
 * ensures a fallback database
 * @param {DataSource} db
 * @return {DataSource}
 */
export function getDataSource(db: DataSource): DataSource {
  return db || DefaultSource
}

type EntityConstructor<T> = new () => T
/**
 * a drop-in replacement for a contructor, but for TypeORM entities
 * @param {DataSource} database
 * @param {EntityConstructor<T>} Entity
 * @param {InitProps} props to init
 * @return {T}
 */
export function useBuild<T, InitProps>(
  database: DataSource,
  Entity: EntityConstructor<T>,
  props: InitProps
): T {
  const entity = new Entity()
  const meta = database.getMetadata(Entity)
  // handle columns first
  meta.columns.forEach((c) => {
    if (c.isGenerated) return
    entity[c.propertyName] = props[c.propertyName] || createEmpty(c.type)
  })
  // handle relations next
  meta.relations.forEach((r) => {
    const prop = r.propertyName
    // skip entirely if prop doesn't have relation
    // because relations can easily afford to be empty
    if (!props[prop]) return
    entity[prop] = props[prop]
  })
  return entity
}

/**
 * takes in a repository, returns a function that is meant to be used
 * as a repository method
 *
 * @param {Repository<ModtreeEntity>} repository
 * @return {LoadRelationsMethod}
 */
export function useLoadRelations(
  repository: Repository<ModtreeEntity>
): LoadRelationsMethod {
  /**
   * updates entity in-place to have relations
   *
   * @param {ModtreeEntity} entity to be updated
   * @param {FindOptionsRelations<ModtreeEntity>} relations
   */
  async function loadRelations(
    entity: ModtreeEntity,
    relations: FindOptionsRelations<ModtreeEntity>
  ) {
    // find itself and load relations into a temporary variable
    const res = await repository.findOne({
      where: {
        id: entity.id,
      },
      relations,
    })
    // iterate through the requested relations and mutate the entity
    Object.keys(relations).map((key) => {
      entity[key] = res[key]
    })
  }
  return loadRelations
}

export function getRelationNames<T>(
  database: DataSource,
  Entity: EntityConstructor<T>,
): Record<string, boolean> {
  const meta = database.getMetadata(Entity)
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => res[r] = true)
  return res
}
