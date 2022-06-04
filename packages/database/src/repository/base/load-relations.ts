import { FindOptionsRelations, Repository } from 'typeorm'
import { LoadRelations } from '../../../types/repository'
import { Base } from '../../entity'

/**
 * takes in a repository, returns a function that is meant to be used
 * as a repository method
 *
 * @param {Repository<Base>} repository
 * @returns {LoadRelations<Base>}
 */
export function useLoadRelations(
  repository: Repository<Base>
): LoadRelations<Base> {
  /**
   * updates entity in-place to have relations
   *
   * @param {Base} entity to be updated
   * @param {FindOptionsRelations<Base>} relations
   */
  async function loadRelations(
    entity: Base,
    relations: FindOptionsRelations<Base>
  ) {
    // find itself and load relations into a temporary variable
    const res = await repository.findOne({
      where: {
        id: entity.id,
      },
      relations,
    })
    // iterate through the requested relations and mutate the entity
    Object.keys(relations).forEach((key) => {
      entity[key] = res[key]
    })
  }
  return loadRelations
}
