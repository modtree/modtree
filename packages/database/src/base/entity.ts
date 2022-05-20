import { FindOptionsRelations, Repository } from 'typeorm'

export class BaseEntity {
  id: number
  /**
   * retrieve own relations
   *
   * @param {FindOptionsRelations<User>} relations
   */
  async loadRelations<T>(
    relations: FindOptionsRelations<T>,
    repository: Repository<BaseEntity>
  ) {
    // find itself and load relations into a temporary variable
    const res = await repository.findOne({
      where: {
        id: this.id,
      },
      relations,
    })
    // iterate through the requested relations and mutate `this`
    Object.keys(relations).map((key) => {
      this[key] = res[key]
    })
  }
}
