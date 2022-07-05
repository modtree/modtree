import { ObjectLiteral, Repository } from 'typeorm'

/* eslint @typescript-eslint/no-explicit-any: 0 */
// all the 'any' types in this file are overloaded.
// still waiting on TypeORM to sort their stuff out.

/**
 * example usage:
 *
 * const BaseRepo = db.getRepository(User)
 * const findOneById = useFindOneByKey(BaseRepo, 'id')
 * findOneById('3316ace0-a791-494a-b1a7-3537e090e61c').then((user) => {
 *   log(user)
 * })
 */
type FindByKey<T> = (value: string) => Promise<T>

/**
 * Returns one Entity with all relations loaded
 *
 * @param {Repository<any>} repository
 * @param {T} key
 * @returns {FindByKey<any>}
 */
export function useFindOneByKey<Entity, T extends keyof Entity>(
  repository: Repository<Entity>,
  key: T
): FindByKey<Entity>
export function useFindOneByKey<
  Entity extends ObjectLiteral,
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
