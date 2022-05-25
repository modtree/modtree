import { DataSource } from 'typeorm'
import { createEmpty } from '../../utils/object'
import { EntityConstructor } from './types'

/**
 * a drop-in replacement for a contructor, but for TypeORM entities
 * @param {DataSource} database
 * @param {EntityConstructor<T>} Entity
 * @param {InitProps} props to init
 * @return {T}
 */
export function useBuild<T, P>(
  database: DataSource,
  Entity: EntityConstructor<T>,
  props: P
): T {
  const entity = new Entity()
  const meta = database.getMetadata(Entity)
  /**
   * for each column, if the column is a generated one, then skip it.
   * else, copy the property value from the props provided.
   * default values are empty values defined in createEmpty.
   */
  meta.columns.forEach((c) => {
    if (c.isGenerated) return
    entity[c.propertyName] = props[c.propertyName] || createEmpty(c.type)
  })
  /**
   * for each relation, if the props provided doesn't include values for that
   * relation, then skip it. Relations can easily be left empty.
   */
  meta.relations.forEach((r) => {
    const prop = r.propertyName
    if (!props[prop]) return
    entity[prop] = props[prop]
  })
  return entity
}
