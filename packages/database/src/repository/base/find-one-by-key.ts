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
type Searchables = { id: Query }
type Query = string | number

/**
 * function that useFindOneByKey returns
 * a function that takes in just one parameter: value,
 * and returns a Promise to one and only one Entity
 */
type FindOneByKey<Entity extends Searchables> = (
  value: Query
) => Promise<Entity>

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
>(repository: Repository<any>, key: T): FindOneByKey<Entity> {
  const relations: Record<string, boolean> = {}
  repository.metadata.relations.forEach((r) => {
    relations[r.propertyName] = true
  })
  return (value: Query) =>
    repository.findOneOrFail({
      where: { [key]: value },
      relations,
    })
}
