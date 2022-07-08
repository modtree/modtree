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
  const meta = repository.metadata
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => {
    res[r] = true
  })
  return res
}
