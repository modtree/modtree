import { Repository } from 'typeorm'

/**
 * example usage:
 *
 * const BaseRepo = db.getRepository(User)
 * const findOneById = useFindOneByKey(BaseRepo, 'id')
 * findOneById('3316ace0-a791-494a-b1a7-3537e090e61c').then((user) => {
 *   console.log(user)
 * })
 */

/**
 * list of usable find keys:
 * the second argument of useFindOneByKey() is constrained by the
 * keys of Searchables
 */
type Searchables = { id: string; title: string; username: string }

/**
 * function that useFindOneByKey returns
 * a function that takes in just one parameter: value,
 * and returns a Promise to one and only one Entity
 */
type FindOneByKey = (value: string) => Promise<any>

/**
 * Returns an Entity with all relations loaded
 *
 * @param {Repository<any>} repository
 * @param {T} key
 * @returns {FindOneByKey<Entity>}
 */
export function useFindOneByKey<
  Entity extends Searchables,
  T extends keyof Entity
>(repository: Repository<any>, key: T): FindOneByKey {
  const relations: Record<string, boolean> = {}
  repository.metadata.relations.forEach((r) => {
    relations[r.propertyName] = true
  })
  return (value: string) =>
    repository.findOneOrFail({
      where: { [key]: value },
      relations,
    })
}

/**
 * Returns an Array Entities with all relations loaded
 *
 * @param {Repository<any>} repository
 * @param {T} key
 * @returns {FindOneByKey<Entity>}
 */
export function useFindByKey<
  Entity extends Searchables,
  T extends keyof Entity
>(repository: Repository<any>, key: T): FindOneByKey {
  const relations: Record<string, boolean> = {}
  repository.metadata.relations.forEach((r) => {
    relations[r.propertyName] = true
  })
  return (value: string) =>
    repository.find({
      where: { [key]: value },
      relations,
    })
}
