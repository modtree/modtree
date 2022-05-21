/**
 * O(1) delete from unsorted array
 * @param {T[]} arr
 * @param {number} index
 * @return {Module}
 */
export function quickpop<T>(arr: T[], index: number): T {
  if (arr.length === 0) return
  const res = arr[index]
  const elem = arr.pop()
  if (arr.length !== index) arr[index] = elem
  return res
}
