import { Repository } from 'typeorm'

type DeleteAll = () => Promise<void>

/**
 * takes in a repository, returns a function that deletes all entities in that repository
 *
 * @param {Repository<T>} repository
 * @returns {DeleteAll}
 */
export function useDeleteAll<T>(repository: Repository<T>): DeleteAll {
  const deleteAll = async () => {
    await repository.clear()
  }
  return deleteAll
}
