import { DataSource, EntityTarget } from 'typeorm'
import { Base } from '../../entity'

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {DataSource} database
 * @param {T} Entity
 * @returns {Record<string, boolean>}
 */
export function getRelationNames<T extends EntityTarget<Base>>(
  database: DataSource,
  Entity: T
): Record<string, boolean> {
  const meta = database.getMetadata(Entity)
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => {
    res[r] = true
  })
  return res
}
