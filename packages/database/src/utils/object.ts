import { ColumnType } from 'typeorm'

/**
 * copies props from source entity to the target entity
 * @param {T} source
 * @param {T} target
 */
export function copy<T>(source: T, target: T) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}

/**
 * creates an empty version of the type that is passed in
 * @param {ColumnType} type of TypeORM Column
 * @return {any}
 */
export function createEmpty(type: ColumnType): any {
  if (type === String) return ''
  if (type === Number) return 0
  if (type === 'longblob') return ''
  if (type === 'text') return ''
  if (type === 'json') return ''
  return ''
}
