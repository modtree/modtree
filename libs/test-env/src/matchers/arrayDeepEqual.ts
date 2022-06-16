/**
 * checks deeply if two arrays contains the same elements
 */
export function arrayDeepEqual<T>(
  equals: jest.MatcherUtils['equals'],
  actual: T[],
  expected: T[]
) {
  if (
    /**
     * reject if either are not arrays
     */
    !Array.isArray(actual) ||
    !Array.isArray(expected) ||
    /**
     * reject if lengths are not the same
     */
    actual.length !== expected.length
  ) {
    return false
  }
  /**
   * remaining denotes the values remaining in the `actual` array
   */
  const remaining = expected.reduce((remaining, expectedElement) => {
    if (remaining === null) return remaining
    const index = remaining.findIndex((actualElement) =>
      /**
       * make use of jest's deep equality check here
       * note that if it fails, the entire function will return false
       */
      equals(actualElement, expectedElement)
    )
    /**
     * reject if remaining doesn't contain element
     */
    if (index === -1) equals(1, 0)
    // pop that index out
    return remaining.slice(0, index).concat(remaining.slice(index + 1))
  }, actual)
  /**
   * returns true if remaining is still defined and is empty
   * given that `actual` and `remaining` has the same length,
   * this is most likely true once the `reduce` function is complete.
   */
  return Boolean(remaining) && remaining.length === 0
}
