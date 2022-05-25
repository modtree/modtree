import { FindOptionsRelations, Repository } from 'typeorm'
import { EntityInstance, LoadRelations } from './types'

/**
 * takes in a repository, returns a function that is meant to be used
 * as a repository method
 *
 * @param {Repository<ModtreeEntity>} repository
 * @return {LoadRelationsMethod}
 */
export function useLoadRelations<T>(
  repository: Repository<EntityInstance<T>>
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
