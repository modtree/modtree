/**
 * O(1) delete from unsorted array
 * @param {T[]} arr
 * @param {number} index
 * @return {Module}
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
 * async filter promise all
 */
export async function filter(arr: string[], callback) {
  const fail: string = 'abcd' // temp
  return (await Promise.all(arr.map(
    async item => (await callback(item)) ? item : fail
  ))).filter(i => i !== fail)
}
