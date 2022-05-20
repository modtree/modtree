import { FindOptionsRelations, Repository, BaseEntity } from 'typeorm'

class ModtreeEntity extends BaseEntity {
  id: number
}

/**
 * updates entity in-place to have relations
 *
 * @param {ModtreeEntity} entity
 * @param {FindOptionsRelations<ModtreeEntity>} relations
 * @param {Repository<ModtreeEntity>} repository
 */
export async function loadRelations(
  entity: ModtreeEntity,
  relations: FindOptionsRelations<ModtreeEntity>,
  repository: Repository<ModtreeEntity>
) {
  // find itself and load relations into a temporary variable
  const res = await repository.findOne({
    where: {
      id: entity.id,
    },
    relations,
  })
  // iterate through the requested relations and mutate `this`
  Object.keys(relations).map((key) => {
    this[key] = res[key]
  })
}
