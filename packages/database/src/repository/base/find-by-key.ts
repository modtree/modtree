import { Repository } from 'typeorm'
import {
  IUser,
  IGraph,
  IDegree,
  IModule,
  IModuleCondensed,
} from '../../entity/types'

/**
 * example usage:
 *
 * const BaseRepo = db.getRepository(User)
 * const findOneById = useFindOneByKey(BaseRepo, 'id')
 * findOneById('3316ace0-a791-494a-b1a7-3537e090e61c').then((user) => {
 *   log(user)
 * })
 */

/**
 * list of usable find keys:
 * the second argument of useFindOneByKey() is constrained by the
 * keys of Searchables
 */
type Searchables = { id: string; title: string; username: string }
type AllEntities = IUser | IGraph | IDegree | IModuleCondensed | IModule

/**
 * function that useFindOneByKey returns
 * a function that takes in just one parameter: value,
 * and returns a Promise to one and only one Entity
 */
type FindByKey<T> = (value: string) => Promise<T>

/**
 * Returns one Entity with all relations loaded
 *
 * @param {Repository<any>} repository
 * @param {T} key
 * @returns {FindOneByKey<Entity>}
 */
export function useFindOneByKey<
  Entity extends Searchables,
  T extends keyof Entity
>(repository: Repository<any>, key: T): FindByKey<any> {
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
  Entity extends AllEntities,
  T extends keyof Entity
>(repository: Repository<any>, key: T): FindByKey<any[]> {
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
