/**
 * filter, but two ways
 * @param {T[]} array: the array to split in two
 * @param {function} check: the same as filter callback
 * @return {[T[], T[]]} the pass-fail array
 */
export function partition<T>(
  array: T[],
  check: (elem: T) => boolean
): [T[], T[]] {
  return array.reduce(
    (result: [pass: T[], fail: T[]], element) => {
      result[check(element) ? 0 : 1].push(element)
      return result
    },
    [[], []]
  )
}

type StrRecord = Record<string, any>
/**
 * copies props from source entity to the target entity
 * @param {StrRecord} source
 * @param {StrRecord} target
 */
export function copy(source: StrRecord, target: StrRecord) {
  Object.keys(source).forEach(key => {
    target[key] = source[key]
  })
}
