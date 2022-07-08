import { EntityMetadata, Repository } from 'typeorm'

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {Repository<T>} repository
 * @returns {Record<string, boolean>}
 */
export function getRelationNames<T>(
  repository: Repository<T>
): Record<string, boolean> {
  const meta = repository.metadata
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => {
    res[r] = true
  })
  return res
}

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {EntityMetadata} metadata
 * @returns {Record<string, boolean>}
 */
export function getRelationsFromMetadata(
  metadata: EntityMetadata
): Record<string, boolean> {
  const relationNames = metadata.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => {
    res[r] = true
  })
  return res
}
