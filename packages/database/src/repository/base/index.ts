import { DataSource, FindOptionsRelations, Repository } from 'typeorm'
import { db as DefaultSource } from '../../config'
import { ModtreeEntity } from '../../entity'
export * from './build'
export * from './load-relations'

/**
 * standards:
 * - entity refers to an instance
 * - Entity refers to the class name
 */

type EntityType<T> = new () => T

export type DeleteAll = () => Promise<void>

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

type LoadRelationsMethod = (
  entity: ModtreeEntity,
  relations: FindOptionsRelations<ModtreeEntity>
) => Promise<void>

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

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {DataSource} database
 * @param {EntityType<T>} Entity
 * @return {Record<string, boolean>}
 */
export function getRelationNames<T>(
  database: DataSource,
  Entity: EntityType<T>
): Record<string, boolean> {
  const meta = database.getMetadata(Entity)
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => (res[r] = true))
  return res
}

/**
 * takes in a repository, returns a function that deletes all entities in that repository
 *
 * @param {Repository<EntityType<T>>} repository
 * @return {DeleteAllMethod}
 */
export function useDeleteAll<Entity>(
  repository: Repository<Entity>
): DeleteAll {
  const deleteAll = async () => {
    await repository.createQueryBuilder().delete().execute()
  }
  return deleteAll
}
