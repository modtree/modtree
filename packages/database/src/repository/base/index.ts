import { DataSource, FindOptionsRelations } from 'typeorm'
export * from './build'
export * from './load-relations'
export * from './delete-all'
export * from './get-source'

/**
 * standards:
 * - entity refers to an instance
 * - Entity refers to the class name
 */

type EntityType<T> = new () => T

export type LoadRelations<T> = (
  entity: T,
  relations: FindOptionsRelations<T>
) => Promise<void>

/**
 * Returns the relation names of an entity,
 * in the format for loadRelations.
 *
 * @param {DataSource} database
 * @param {EntityType<T>} Entity
 * @return {Record<string, boolean>}
 */
export function getRelationNames<T>(
  database: DataSource,
  Entity: EntityType<T>
): Record<string, boolean> {
  const meta = database.getMetadata(Entity)
  const relationNames = meta.relations.map((r) => r.propertyName)
  // make into Record for loadRelations
  const res: Record<string, boolean> = {}
  relationNames.forEach((r) => (res[r] = true))
  return res
}
