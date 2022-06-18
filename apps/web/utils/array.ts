/**
 * filter, but two ways
 * @param {T[]} array: the array to split in two
 * @param {function} check: the same as filter callback
 * @return {[T[], T[]]} the pass-fail array
 */
export function partition<T>(array: T[], check: (_: T) => boolean): [T[], T[]] {
  return array.reduce(
    (result: [pass: T[], fail: T[]], element) => {
      result[check(element) ? 0 : 1].push(element)
      return result
    },
    [[], []]
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StrRecord = Record<string, any>
/**
 * copies props from source entity to the target entity
 * @param {StrRecord} source
 * @param {StrRecord} target
 */
export function copy(source: StrRecord, target: StrRecord) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}

/**
 * make a dash-separated string out of an array
 *
 * intended use: for keys in React element mapping
 *
 * @param {string[]} ...arr
 * @returns {string}
 */
export function dashed(...arr: (string | number)[]): string {
  return arr.join('-')
}
