import { Relations } from '@modtree/types'
import { Repository } from 'typeorm'

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {Repository<T>} repository
 * @returns {Record<string, boolean>}
 */
export function getRelations<T>(repository: Repository<T>): Relations {
  const r = repository.metadata.relations
  return r.reduce((acc, cur) => ({ ...acc, [cur.propertyName]: true }), {})
}
