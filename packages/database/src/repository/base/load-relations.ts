import { FindOptionsRelations, Repository } from 'typeorm'
import { EntityConstructor, EntityInstance, LoadRelations } from './types'

/**
 * takes in a repository, returns a function that is meant to be used
 * as a repository method
 *
 * @param {Repository<ModtreeEntity>} repository
 * @return {LoadRelationsMethod}
 */
export function useLoadRelations<T>(
  repository: Repository<EntityConstructor<T>>
): LoadRelations<EntityInstance<T>> {
  /**
   * updates entity in-place to have relations
   *
   * @param {ModtreeEntity} entity to be updated
   * @param {FindOptionsRelations<ModtreeEntity>} relations
   */
  async function loadRelations<T>(
    entity: EntityInstance<T>,
    relations: FindOptionsRelations<EntityInstance<T>>
  ) {
    // find itself and load relations into a temporary variable
    await repository
      .findOne({
        where: { id: entity.id },
        relations,
      })
      .then((res) => {
        // iterate through the requested relations and mutate the entity
        Object.keys(relations).map((key) => {
          entity[key] = res[key]
        })
      })
  }
  return loadRelations
}
