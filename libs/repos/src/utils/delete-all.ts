import { DeleteResult, Repository } from 'typeorm'

type DeleteAll = () => Promise<DeleteResult>

/**
 * takes in a repository, returns a function that deletes all entities in that repository
 *
 * @param {Repository<T>} repository
 * @returns {DeleteAll}
 */
export function useDeleteAll<T>(repository: Repository<T>): DeleteAll {
  return () => repository.createQueryBuilder().delete().execute()
}
