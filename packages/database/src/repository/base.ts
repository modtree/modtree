import { DataSource, FindOptionsRelations, Repository } from 'typeorm'
import { db as DefaultSource } from '../config'
import { ModtreeEntity } from '../entity'

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
