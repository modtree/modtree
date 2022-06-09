/**
 * O(1) delete from unsorted array
 *
 * @param {T[]} arr
 * @param {number} index
 * @returns {T}
 */
export function quickpop<T>(arr: T[], index: number): T {
  if (arr.length === 0) throw new Error('Tried to quickpop an empty array')
  if (index >= arr.length || index < 0) throw new Error('Out of bounds')
  const res = arr[index]
  const elem = arr.pop()
  if (!elem) throw new Error('Quickpop somehow popped an undefined element')
  if (arr.length !== index) arr[index] = elem
  return res
}

/**
 * Remove duplicate entries from array
 *
 * @param {T[]} arr
 * @returns {T[]}
 */
export function unique<T>(arr: T[]): T[] {
  const set = new Set<T>(arr)
  return Array.from(set)
}
