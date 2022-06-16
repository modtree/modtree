/* eslint-disable  @typescript-eslint/no-explicit-any */

import { ColumnType } from 'typeorm'

type StrRecord = Record<string, any>
/**
 * copies props from source entity to the target entity
 *
 * @param {StrRecord} source
 * @param {StrRecord} target
 */
export function copy(source: StrRecord, target: StrRecord) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}

/**
 * creates an empty version of the type that is passed in
 *
 * @param {ColumnType} type of TypeORM Column
 * @returns {any}
 */
export function createEmpty(type: ColumnType): any {
  if (type === String) return ''
  if (type === Number) return 0
  if (type === 'longblob') return ''
  if (type === 'text') return ''
  if (type === 'json') return ''
  return ''
}
