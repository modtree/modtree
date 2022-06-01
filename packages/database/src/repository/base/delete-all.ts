import { Repository } from 'typeorm'

type DeleteAll = () => Promise<void>

/**
 * takes in a repository, returns a function that deletes all entities in that repository
 *
 * @param {Repository<EntityType<T>>} repository
 * @return {DeleteAll}
 */
export function useDeleteAll<Entity>(
  repository: Repository<Entity>
): DeleteAll {
  const deleteAll = async () => {
    await repository.createQueryBuilder().delete().execute()
  }
  return deleteAll
}
